import { createContext, useContext, useState } from 'react';
import { authenticate } from '../services/api';

const AuthContext = createContext(null);

const STORAGE_KEY = 'leaveflow_user';

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      return raw ? JSON.parse(raw) : null;
    } catch {
      return null;
    }
  });

  const login = async (employeeId, password, role) => {
    const authenticated = await authenticate(employeeId, password, role);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(authenticated));
    setUser(authenticated);
    return authenticated;
  };

  const logout = () => {
    localStorage.removeItem(STORAGE_KEY);
    setUser(null);
  };

  return <AuthContext.Provider value={{ user, login, logout }}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within an AuthProvider');
  return context;
}
