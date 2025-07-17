import { useContext, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../../context/AuthContext';
import { backendUrl } from '../../utils/backendUrl';
import { LikedContext } from '../../context/LikedContext';
import { toast } from 'react-toastify';
import Loading from '../../utils/Loading';
// import { useCart } from '../../context/CartContext';



const Logout = () => {
  const navigate = useNavigate();
  const { setIsAuthenticated, isAuthenticated } = useAuth();
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
        toast.error(err?.message || "Error logging out :(", err);
        setLoading(false)
      }

     setLoading(false)
    };
    if(isAuthenticated){
  logoutUser();
    }

  
  }, [navigate, setIsAuthenticated, isAuthenticated]);

  return loading ? (
 <Loading message='Logging you out...'/>
) : null;

};

export default Logout;
