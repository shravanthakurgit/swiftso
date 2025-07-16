import { createContext, useContext, useState, useEffect, useRef } from "react";
import axiosInstance from "../api/axiosInstance";
import { toast } from "react-toastify";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(
    !!localStorage.getItem("accessToken")
  );
  const [isLoading, setIsLoading] = useState(true);
  const [userData, setUserData] = useState(null || []);
  const [userAddress, setUserAddress] = useState(null || []);

  const accessToken = localStorage.getItem("accessToken");

  const checkAuth = async () => {
    try {
      if (!accessToken) {
        setIsAuthenticated(false);
        return;
      }

      const res = await axiosInstance.post("/api/user/profile");
      console.log(accessToken)

      if (res?.data?.success) {
        setIsAuthenticated(true);
        setUserData(res.data.user);
        setUserAddress(res.data.user.address || null);
      } else {
        setIsAuthenticated(false);
      }
    } catch (error) {
      if (!navigator.onLine) {
        return;
      }
      setIsAuthenticated(false);
    //  toast.error(error?.response?.data?.message || error?.message || "Something went wrong");
    return null;
    } finally {
      setIsLoading(false);
    }
  };

  const didCheck = useRef(false);

  useEffect(() => {
    if (didCheck.current) return;
    didCheck.current = true;

    checkAuth();

    const handleReconnect = () => {
      checkAuth();
    };

    window.addEventListener("online", handleReconnect);

    return () => {
      window.removeEventListener("online", handleReconnect);
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
