import { createContext, useContext, useEffect, useState } from 'react';
import { authApi } from '../api';

const AuthContext = createContext(null);

const getStoredToken = () => {
  if (typeof window === 'undefined') return null;
  return localStorage.getItem('ta_token');
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [bootstrapToken] = useState(() => getStoredToken());
  const [loading, setLoading] = useState(() => Boolean(bootstrapToken));

  useEffect(() => {
    if (!bootstrapToken) return;
    let active = true;

    const fetchProfile = async () => {
      try {
        const res = await authApi.me();
        if (!active) return;
        setUser(res.data.data?.user);
      } catch {
        localStorage.removeItem('ta_token');
        if (active) setUser(null);
      } finally {
        if (active) setLoading(false);
      }
    };

    fetchProfile();

    return () => {
      active = false;
    };
  }, [bootstrapToken]);

  const handleAuth = (payload, handler) =>
    handler(payload).then((res) => {
      const { token, user: profile } = res.data.data;
      localStorage.setItem('ta_token', token);
      setUser(profile);
      return profile;
    });

  const login = (payload) => handleAuth(payload, authApi.login);
  const register = (payload) => handleAuth(payload, authApi.register);

  const logout = () => {
    localStorage.removeItem('ta_token');
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

// eslint-disable-next-line react-refresh/only-export-components
export function useAuth() {
  return useContext(AuthContext);
}
