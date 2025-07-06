// src/context/AuthContext.js
import React, { createContext, useContext, useState, useEffect } from 'react';
import axiosInstance from '../api/axiosInstance';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(!!localStorage.getItem('accessToken'));
  const [isLoading, setIsLoading] = useState(true);
  const [userData, setUserData] = useState(null || []);
  const [userAddress, setUserAddress] = useState(null || []);

  const accessToken = localStorage.getItem('accessToken');

  const checkAuth = async () => {
    try {
      if (!accessToken) {
        setIsAuthenticated(false);
        return;
      }

      const res = await axiosInstance.get('/api/user/profile');

      if (res?.data?.success) {
        setIsAuthenticated(true);
        setUserData(res.data.user);
        setUserAddress(res.data.user.address || null);
      } else {
        setIsAuthenticated(false);
      }

    } catch (error) {
      if (!navigator.onLine) {
        console.warn('User is offline — preserving authentication state.');
        return;
      }

      console.error('Auth check failed:', error);
      setIsAuthenticated(false);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    checkAuth();

    // Re-check authentication on network reconnect
    const handleReconnect = () => {
      console.log('Reconnected — checking authentication again.');
      checkAuth();
    };

    window.addEventListener('online', handleReconnect);

    return () => {
      window.removeEventListener('online', handleReconnect);
    };
  }, []);

  return (
    <AuthContext.Provider
      value={{
        isAuthenticated,
        setIsAuthenticated,
        isLoading,
        userData,
        setUserData,
        userAddress,
        setUserAddress,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
