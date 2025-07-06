// src/api/axiosInstance.js
import axios from 'axios';
import { refreshAccessToken } from '../auth/authService';
import { useAuth } from '../context/AuthContext';

const baseURL = process.env.REACT_APP_BACKEND_URL;

const axiosInstance = axios.create({
  baseURL,
  withCredentials: true,
});


export const setupInterceptors = (setIsAuthenticated) => {



axiosInstance.interceptors.request.use(
  config => {
    const accessToken = localStorage.getItem('accessToken');
    if (accessToken) {
      config.headers['Authorization'] = `Bearer ${accessToken}`;
    }
    return config;
  },
  error => Promise.reject(error)
);

// Handle 401 & refresh token
axiosInstance.interceptors.response.use(
  response => response,
  async error => {
    const originalRequest = error.config;

   
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      try {
        const newAccessToken = await refreshAccessToken();
        if (newAccessToken) {
            setIsAuthenticated(true);
            console.log("[INTERCEPTOR NEW TOKEN]", newAccessToken);
          localStorage.setItem('accessToken', newAccessToken)
          originalRequest.headers['Authorization'] = `Bearer ${newAccessToken}`;
          return axiosInstance(originalRequest)
        }
      } catch (refreshError) {
 
  if (!window.navigator.onLine) {
  
    return Promise.reject(error);
  }

  setIsAuthenticated(false);
  localStorage.removeItem('accessToken');
  localStorage.removeItem('refreshToken');
  window.location.href = '/login';
}
    }

    return Promise.reject(error);
  }
);


 }

export default axiosInstance;
