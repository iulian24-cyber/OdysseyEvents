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

  const clearLogoutTimer = () => {
    if (window.logoutTimer) {
      clearTimeout(window.logoutTimer);
      window.logoutTimer = null;
    }
  };

  /* ==============================
     LOGOUT — CLEAN & SIMPLE
  =============================== */
  const logout = () => {
    clearLogoutTimer();
    localStorage.removeItem("token");
    setUser(null);
    setToken(null);

    // Just change the hash; App.jsx will handle route
    window.location.hash = "#/signin";
  };

  /* ==============================
     LOGIN
  =============================== */
  const login = (token, userData) => {
    setToken(token);
    setUser(userData);
    localStorage.setItem("token", token);

    const expiry = getTokenExpiry(token);
    const timeout = expiry - Date.now();

    if (timeout > 0) {
      window.logoutTimer = setTimeout(logout, timeout);
    }
  };

  /* ==============================
     RESTORE SESSION ON REFRESH
  =============================== */
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
          localStorage.removeItem("token");
          setLoading(false);
          return;
        }

        setToken(storedToken);

        // Fetch full user data
        const userData = await api("/auth/me");
        setUser(userData);

        const timeout = expiry - Date.now();
        if (timeout > 0) {
          window.logoutTimer = setTimeout(logout, timeout);
        }
      } catch {
        localStorage.removeItem("token");
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
