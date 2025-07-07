import { useContext, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../../context/AuthContext';
import { backendUrl } from '../../utils/backendUrl';
import { LikedContext } from '../../context/LikedContext';



const Logout = () => {
  const navigate = useNavigate();
  const { setIsAuthenticated } = useAuth();
  const {syncLikedItems}= useContext(LikedContext);

  useEffect(() => {
    const logoutUser = async () => {
      try {
        await syncLikedItems();
        await axios.post(`${backendUrl}/api/user/logout`, {}, {
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
