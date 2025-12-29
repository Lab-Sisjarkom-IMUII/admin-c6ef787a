'use client';

import { createContext, useContext, useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { login as loginApi } from '@/utils/api';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    // Check if user is already logged in
    const token = localStorage.getItem('admin_token');
    if (token) {
      // TODO: Verify token with backend
      // For now, just set user as logged in
      setUser({ token });
    }
    setLoading(false);
  }, []);

  const login = async (username, password) => {
    try {
      const response = await loginApi(username, password);
      // loginApi() sudah normalize response ke format: { success: true, token: "...", user: {...} }
      // Support both admin field (API sebenarnya) dan user field (mock data)
      if (response.success && response.token) {
        localStorage.setItem('admin_token', response.token);
        const userData = response.user || response.admin || {};
        setUser({ 
          token: response.token, 
          username: userData.username || username,
          id: userData.id,
          email: userData.email,
          role: userData.role || 'admin'
        });
        return { success: true };
      }
      throw new Error(response.message || 'Login failed');
    } catch (error) {
      return { success: false, error: error.message };
    }
  };

  const logout = () => {
    localStorage.removeItem('admin_token');
    setUser(null);
    router.push('/login');
  };

  const value = {
    user,
    loading,
    login,
    logout,
    isAuthenticated: !!user,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  
  // Runtime check untuk memastikan kita berada di client-side
  // Ini mencegah error saat build time ketika Next.js mencoba melakukan static analysis
  if (typeof window === 'undefined') {
    // Return default values saat SSR/build time
    // Jangan throw error saat build time, return default values saja
    return {
      user: null,
      loading: true,
      login: async () => ({ success: false, error: 'Not available during SSR' }),
      logout: () => {},
      isAuthenticated: false,
    };
  }
  
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
}
