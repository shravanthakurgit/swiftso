import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../../context/AuthContext';


const Logout = () => {
  const navigate = useNavigate();
  const { setIsAuthenticated } = useAuth();

  useEffect(() => {
    const logoutUser = async () => {
      try {
        await axios.post(`${process.env.REACT_APP_BACKEND_URL}/api/user/logout`, {}, {
          withCredentials: true,
        });
      } catch (err) {
        console.error("Error logging out:", err);
      }

      localStorage.removeItem("accessToken");
      localStorage.removeItem("refreshToken");

      setIsAuthenticated(false);
      navigate("/");
    };

    logoutUser();
  }, [navigate, setIsAuthenticated]);

  return null;
};

export default Logout;
