import React, { createContext, useState, useEffect } from 'react';
import api from '../services/api';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('token');
    const storedUsername = localStorage.getItem('username');
    const storedRole = localStorage.getItem('role');
    
    if (token && storedUsername && storedRole) {
      setUser({ username: storedUsername, role: storedRole });
      setIsAuthenticated(true);
    }
    setLoading(false);
  }, []);

  const login = async (username, password) => {
    try {
      const response = await api.post('/auth/login', { username, password });
      const { token, username: resUsername, role } = response.data;
      
      localStorage.setItem('token', token);
      localStorage.setItem('username', resUsername);
      localStorage.setItem('role', role);
      
      setUser({ username: resUsername, role });
      setIsAuthenticated(true);
      return { success: true };
    } catch (error) {
      console.error("Login hatası:", error);
      return { 
        success: false, 
        message: error.response?.data?.error || 'Kullanıcı adı veya şifre hatalı.' 
      };
    }
  };

  const register = async (userData) => {
    try {
      await api.post('/auth/register', userData);
      return { success: true };
    } catch (error) {
      console.error("Register hatası:", error);
      return { 
        success: false, 
        message: error.response?.data?.error || 'Kayıt işlemi başarısız oldu.' 
      };
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('username');
    localStorage.removeItem('role');
    setUser(null);
    setIsAuthenticated(false);
  };

  return (
    <AuthContext.Provider value={{ user, isAuthenticated, loading, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
