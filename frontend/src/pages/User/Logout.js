import { useContext, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../../context/AuthContext';
import { backendUrl } from '../../utils/backendUrl';
import { LikedContext } from '../../context/LikedContext';
import { toast } from 'react-toastify';
// import { useCart } from '../../context/CartContext';



const Logout = () => {
  const navigate = useNavigate();
  const { setIsAuthenticated } = useAuth();
  const {syncLikedItems}= useContext(LikedContext);
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    const logoutUser = async () => {
      try {
setLoading(true)
        await syncLikedItems();
        await axios.post(`${backendUrl}/api/user/logout`, {}, {
          withCredentials: true,
        });
        localStorage.clear();

setIsAuthenticated(false);
      navigate("/");
      } catch (err) {
        toast.error(err?.message || "Error logging out:", err);
        setLoading(false)
      }

     setLoading(false)
    };

    logoutUser();
  }, [navigate, setIsAuthenticated]);

  return loading ? (
  <div className="fixed inset-0 flex items-center justify-center bg-gray-900 bg-opacity-80 z-50">
    <div className="text-center">
      <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-white mx-auto mb-6"></div>
      <p className="text-white text-md font-semibold tracking-wide monst">Logging you out...</p>
    </div>
  </div>
) : null;

};

export default Logout;
