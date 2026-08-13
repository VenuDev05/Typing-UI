import { createContext, useContext, useEffect, useState, useCallback } from 'react';
import { fetchMe, loginUser, registerUser, setToken, getToken } from '../api/client.js';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Restore session on load.
  useEffect(() => {
    if (!getToken()) { setLoading(false); return; }
    fetchMe()
      .then((d) => setUser(d.user))
      .catch(() => setToken(null))
      .finally(() => setLoading(false));
  }, []);

  const login = useCallback(async (username, password) => {
    const { token, user: u } = await loginUser({ username, password });
    setToken(token);
    setUser(u);
    return u;
  }, []);

  const register = useCallback(async (username, password, displayName) => {
    const { token, user: u } = await registerUser({ username, password, displayName });
    setToken(token);
    setUser(u);
    return u;
  }, []);

  const logout = useCallback(() => {
    setToken(null);
    setUser(null);
  }, []);

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used inside AuthProvider');
  return ctx;
}
