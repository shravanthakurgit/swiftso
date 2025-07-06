// hooks/useToken.js
import { useState, useEffect } from 'react';

export const useToken = () => {
  const [token, setToken] = useState(() =>
    localStorage.getItem("accessToken") || localStorage.getItem("refreshToken")
  );

  useEffect(() => {
    const handleStorageChange = () => {
      const newToken = localStorage.getItem("accessToken") || localStorage.getItem("refreshToken");
      setToken(newToken);
    };

    window.addEventListener("storage", handleStorageChange);

    return () => window.removeEventListener("storage", handleStorageChange);
  }, []);

  return token;
};
