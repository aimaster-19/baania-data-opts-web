import React, { createContext, useContext, useState, useEffect } from 'react';
import api from '../lib/axios';

interface User {
  id: string;
  email: string;
  [key: string]: any;
}

interface AuthContextType {
  user: User | null;
  token: string | null;
  login: (token: string, userData: User) => void;
  logout: () => Promise<void>;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(localStorage.getItem('token'));
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchUser = async () => {
      if (!token) {
        setIsLoading(false);
        return;
      }
      try {
        const { data } = await api.get('/auth/me');
        if (data.status === 200 && data.user) {
          setUser(data.user);
        }
      } catch (error) {
        console.error('Failed to fetch user profiles, attempting to refresh token...', error);
        try {
          const refreshRes = await api.post('/auth/refresh');
          if (refreshRes.data.status === 200) {
            const newToken = refreshRes.data.token;
            setToken(newToken);
            localStorage.setItem('token', newToken);
            
            // Re-fetch user
            const meRes = await api.get('/auth/me', {
              headers: { Authorization: `Bearer ${newToken}` }
            });
            if (meRes.data.status === 200 && meRes.data.user) {
              setUser(meRes.data.user);
            }
          } else {
             throw new Error("Refresh failed");
          }
        } catch (refreshError) {
          console.error("Refresh failed", refreshError);
          // Token is completely invalid, logout locally
          setToken(null);
          setUser(null);
          localStorage.removeItem('token');
        }
      } finally {
        setIsLoading(false);
      }
    };

    fetchUser();
  }, [token]);

  const login = (newToken: string, userData: User) => {
    setToken(newToken);
    setUser(userData);
    localStorage.setItem('token', newToken);
  };

  const logout = async () => {
    try {
      if (token) {
        await api.post('/auth/logout');
      }
    } catch (e) {
      console.error('Logout request failed', e);
    } finally {
      setToken(null);
      setUser(null);
      localStorage.removeItem('token');
    }
  };

  return (
    <AuthContext.Provider value={{ user, token, login, logout, isLoading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
