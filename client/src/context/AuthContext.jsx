import React, { createContext, useContext, useState } from 'react';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  // For demo purposes, role can be 'moderator' or 'user'.
  // Replace this simple mock with your real authentication state in production.
  const [user, setUser] = useState({ name: 'Admin', role: 'moderator' });
  return (
    <AuthContext.Provider value={{ user, setUser }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
