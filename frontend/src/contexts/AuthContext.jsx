// src/contexts/AuthContext.jsx
import React, { createContext, useState, useContext, useEffect, useCallback, useMemo } from 'react';
import apiClient from '../services/api';

// Use undefined as the default value
const AuthContext = createContext(undefined);

// --- Ensure AuthProvider is EXPORTED ---
export const AuthProvider = ({ children }) => {
// --- --- --- --- --- --- --- --- --- ---
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(() => localStorage.getItem('accessToken'));
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const storedToken = localStorage.getItem('accessToken');
    const storedUser = localStorage.getItem('user');
    if (storedToken) {
      setToken(storedToken);
      if (storedUser) {
        try {
          setUser(JSON.parse(storedUser));
        } catch (error) {
          console.error("AuthContext: Failed to parse stored user", error);
          localStorage.removeItem('user');
        }
      }
    }
    setLoading(false);
  }, []);

  const login = useCallback(async (email, password) => {
    try {
      setLoading(true);
      const response = await apiClient.post('/auth/login', { email, password });
      const { access_token, user: userData } = response.data;
      localStorage.setItem('accessToken', access_token);
      localStorage.setItem('user', JSON.stringify(userData));
      setToken(access_token);
      setUser(userData);
      setLoading(false);
      return true;
    } catch (error) {
      console.error('AuthContext: Login failed:', error.response?.data?.message || error.message);
      localStorage.removeItem('accessToken');
      localStorage.removeItem('user');
      setToken(null);
      setUser(null);
      setLoading(false);
      throw error;
    }
  }, []);

  const signup = useCallback(async (email, password) => {
    try {
        setLoading(true);
        await apiClient.post('/auth/signup', { email, password });
        setLoading(false);
        return true;
    } catch (error) {
        console.error('AuthContext: Signup failed:', error.response?.data?.message || error.message);
        setLoading(false);
        throw error;
    }
  }, []);

  const logout = useCallback(() => {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('user');
    setToken(null);
    setUser(null);
    console.log('AuthContext: User logged out');
  }, []);

  const isAuthenticated = !!token;

  const contextValue = useMemo(() => ({
    user,
    token,
    isAuthenticated,
    loading,
    login,
    signup,
    logout,
  }), [user, token, isAuthenticated, loading, login, signup, logout]);

  return (
    <AuthContext.Provider value={contextValue}>
      {!loading && children}
    </AuthContext.Provider>
  );
}; // --- End of AuthProvider component ---

// --- Ensure useAuth is EXPORTED ---
export const useAuth = () => {
// --- --- --- --- --- --- --- --- ---
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};