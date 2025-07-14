import { useState, useEffect } from "react";
import { FaCircleArrowRight } from "react-icons/fa6";
import {
  MdFavoriteBorder,
  MdShoppingBag,
  MdReplay,
  MdCreditCard,
  MdLocationOn,
  MdLiveHelp,
  MdHelp,
  MdSettings,
  MdLogout,
  MdEdit,
} from "react-icons/md";
import { NavLink, useNavigate } from "react-router-dom";
import Error from "../../utils/Error";
import { token } from "../../utils/Token";
import { useAuth } from "../../context/AuthContext";
import ConfirmAlert from "../../utils/ConfirmAlert";
import { toast } from 'react-toastify';
import axiosInstance from "../../api/axiosInstance";


const AccountOption = ({ icon: Icon, label }) => (
  <div className="flex items-center justify-between py-3 px-4 hover:bg-gray-50 cursor-pointer">
    <div className="flex items-center space-x-3">
      <Icon className="text-xl text-gray-600" />
      <span className="text-sm font-medium text-gray-800">{label}</span>
    </div>
    <span className="text-gray-400">{<FaCircleArrowRight />}</span>
  </div>
);


const COOLDOWN_SECONDS = 600;

const MyAccount = () => {
  const { userData } = useAuth();
  const navigate = useNavigate();
  const [showLogoutAlert, setShowLogoutAlert] = useState(false);
const [cooldown, setCooldown] = useState(0); // in seconds
  const [isAnimating, setIsAnimating] = useState(false);
  const handleLogout = () => {
    navigate("/logout");
  };


  
  

const handleResendEmail = async () => {
  try {
    const res = await axiosInstance.post('/api/user/resend-verification', {}, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
    toast.success(res.data.message);
  } catch (err) {
    toast.error(err.response?.data?.message || "Failed to resend verification.");
  }
};

 useEffect(() => {
    if (cooldown <= 0) return;
    const interval = setInterval(() => {
      setCooldown(prev => {
        if (prev <= 1) {
          localStorage.removeItem("lastResendTime");
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [cooldown]);

  const handleClick = () => {
    handleResendEmail(); // backend logic
    localStorage.setItem("lastResendTime", Date.now());
    setCooldown(COOLDOWN_SECONDS);
  };

  const formatTime = (seconds) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m}:${s < 10 ? '0' : ''}${s}`;
  };

    useEffect(() => {
    if (isAnimating) {
      const timer = setTimeout(() => setIsAnimating(false), 1000); // fade duration
      return () => clearTimeout(timer);
    }
  }, [isAnimating]);


useEffect(() => {
  const lastResendTime = localStorage.getItem("lastResendTime");
  if (lastResendTime) {
    const elapsed = Math.floor((Date.now() - parseInt(lastResendTime)) / 1000);
    const remaining = COOLDOWN_SECONDS - elapsed;
    if (remaining > 0) {
      setCooldown(remaining);
    } else {
      localStorage.removeItem("lastResendTime");
    }
  }
}, []);


  useEffect(() => {

    if (showLogoutAlert) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }

    return () => {
      document.body.style.overflow = "";
    };
  }, [showLogoutAlert]);

  return userData && Object.keys(userData).length > 0 && token ? (
    <div className="flex flex-col max-w-lg mx-auto p-4 ">
      <div className="bg-gradient-to-r from-blue-600 to-purple-400 text-white poppins p-4 text-sm">
        <p className="font-semibold">25% Summer discount</p>
        <p>
          Apply code <strong>SUMMER25</strong> on your next purchase
        </p>
      </div>

      {/* Profile Info */}
      <div className="p-4 flex justify-between w-full">
        <div className="text-left">
          <p className="text-lg font-semibold text-gray-900">
            Hi,{" "}
            {userData.first_name?.charAt(0).toUpperCase() +
              userData.first_name?.slice(1).toLowerCase()}
          </p>

          <p className="text-sm text-gray-600">{userData.email}</p>
            
      {!userData?.verified_email && (
  <div
    className={`transition-opacity duration-1000 ${
      isAnimating ? "opacity-100" : "opacity-80"
    }`}
  >
    <button
      onClick={handleClick}
      className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 text-xs mt-6 disabled:bg-gray-400 disabled:cursor-not-allowed"
      disabled={cooldown > 0}
    >
      {cooldown > 0
        ? `Resend available in ${formatTime(cooldown)}`
        : "Resend Verification Email"}
    </button>
  </div>
)}

           
        </div>


     


        <button
          className="bg-gray-100 px-3 monst text-[10px] rounded shadow-sm flex items-center gap-1 max-h-[25px] font-semibold"
          onClick={() => navigate("/update-user-details")}
        >
          Edit <MdEdit />
        </button>
      </div>

      <div className="mx-auto bg-white rounded-b shadow-md overflow-hidden mt-6 flex flex-col sm:flex-row w-full gap-1">
        {/* Header */}

        <div className="w-full">
          <div className="divide-y border-b border-t">
            <NavLink to="/liked">
              <AccountOption icon={MdFavoriteBorder} label="Wishlist" />
            </NavLink>

            <NavLink to="/my-orders">
              <AccountOption icon={MdShoppingBag} label="Orders" />
            </NavLink>

            <NavLink to="/my-account/return-orders">
              <AccountOption icon={MdReplay} label="Returns" />
            </NavLink>
            <AccountOption icon={MdCreditCard} label="Billing" />

            <NavLink to="/my-account/address">
              <AccountOption icon={MdLocationOn} label="Address" />
            </NavLink>
            {/* <AccountOption icon={MdLocalOffer} label="Discounts" /> */}
          </div>
        </div>

        <div className="bg-gray-400 border "></div>

        <div className="w-full ">
          {/* Section 2 */}
          <div className="divide-y border-b border-t ">
            {/* <AccountOption icon={MdLocalShipping} label="Shipping" /> */}
            <AccountOption icon={MdLiveHelp} label="FAQ" />
            <AccountOption icon={MdHelp} label="Help & Support" />
            <AccountOption icon={MdSettings} label="Settings" />
          </div>
        </div>

        {/* Logout */}
      </div>

      <div
        className="p-4 flex items-center justify-between text-red-600 hover:bg-gray-200 cursor-pointer bg-red-100  hover:text-gray-400"
        onClick={() => setShowLogoutAlert(true)}
      >
        <div className="flex items-center gap-2 font-semibold">Logout</div>
        <span className="">{<MdLogout />}</span>
      </div>

      {showLogoutAlert && (
        <ConfirmAlert
          message="Are you sure want to logout ?"
          runFunction={handleLogout}
          hideAlert={() => setShowLogoutAlert(false)}
        />
      )}
    </div>
  ) : (
    <Error message={!token ? "Login First" : "Network / Server Issue"} />
  );
};

export default MyAccount;
