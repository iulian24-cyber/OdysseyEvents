import { createContext, useContext, useEffect, useState } from "react";
import { api } from "../services/api";

const AuthContext = createContext();

const getTokenExpiry = (token) => {
  const payload = JSON.parse(atob(token.split(".")[1]));
  return payload.exp * 1000;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(true);

  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem("token");
    window.location.hash = "#/signin";
  };

  const login = (token, user) => {
    setToken(token);
    setUser(user);
    localStorage.setItem("token", token);

    const expiry = getTokenExpiry(token);
    const timeout = expiry - Date.now();
    setTimeout(logout, timeout);
  };

  useEffect(() => {
    const restoreSession = async () => {
      const storedToken = localStorage.getItem("token");
      if (!storedToken) {
        setLoading(false);
        return;
      }

      try {
        const expiry = getTokenExpiry(storedToken);
        if (expiry < Date.now()) {
          logout();
          setLoading(false);
          return;
        }

        setToken(storedToken);

        // ✅ FETCH FULL USER (includes preferredCategories)
        const userData = await api("/auth/me");
        setUser(userData);

        const timeout = expiry - Date.now();
        setTimeout(logout, timeout);
      } catch {
        logout();
      } finally {
        setLoading(false);
      }
    };

    restoreSession();
  }, []);


  return (
    <AuthContext.Provider value={{ user, token, loading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
