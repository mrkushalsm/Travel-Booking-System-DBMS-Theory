import { createContext, useContext, useEffect, useState } from 'react';
import { authApi } from '../api';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('ta_token');
    if (!token) {
      setLoading(false);
      return;
    }

    authApi
      .me()
      .then((res) => setUser(res.data.data?.user))
      .catch(() => localStorage.removeItem('ta_token'))
      .finally(() => setLoading(false));
  }, []);

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

export const useAuth = () => useContext(AuthContext);
