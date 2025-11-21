'use client';

import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import Cookies from 'js-cookie';
import { useRouter } from 'next/navigation';
import { apolloClient } from '@/lib/apollo-client';
import { restClient } from '@/lib/rest-client';
import { LOGOUT } from '@/lib/graphql/mutations';

interface User {
  id: number;
  username: string;
  createdAt: string;
  updatedAt: string;
}

interface AuthContextType {
  user: User | null;
  token: string | null;
  loading: boolean;
  login: (username: string, password: string) => Promise<void>;
  register: (username: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const storedToken = Cookies.get('authToken');
    const storedUser = Cookies.get('user');

    if (storedToken && storedUser) {
      try {
        setToken(storedToken);
        setUser(JSON.parse(storedUser));
      } catch (error) {
        console.error('Error parsing stored user:', error);
        Cookies.remove('authToken');
        Cookies.remove('user');
      }
    }
    setLoading(false);
  }, []);

  const login = useCallback(async (username: string, password: string) => {
    try {
      const response = await restClient.login({ username, password });
      setToken(response.accessToken);
      setUser(response.user);
      Cookies.set('authToken', response.accessToken, { expires: 7 }); // 7 days
      Cookies.set('user', JSON.stringify(response.user), { expires: 7 });
    } catch (error) {
      throw error;
    }
  }, []);

  const register = useCallback(async (username: string, password: string) => {
    try {
      const response = await restClient.register({ username, password });
      setToken(response.accessToken);
      setUser(response.user);
      Cookies.set('authToken', response.accessToken, { expires: 7 });
      Cookies.set('user', JSON.stringify(response.user), { expires: 7 });
    } catch (error) {
      throw error;
    }
  }, []);

  const logout = useCallback(async () => {
    try {
      if (token) {
        await apolloClient.mutate({
          mutation: LOGOUT,
        });
      }
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      setToken(null);
      setUser(null);
      Cookies.remove('authToken');
      Cookies.remove('user');
      apolloClient.clearStore();
      router.push('/login');
    }
  }, [token, router]);

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        loading,
        login,
        register,
        logout,
        isAuthenticated: !!token && !!user,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}

