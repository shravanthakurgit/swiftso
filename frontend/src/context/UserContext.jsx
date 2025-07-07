import { createContext, useContext, useEffect, useState } from "react";
import axiosInstance from "../api/axiosInstance";
import { backendUrl } from "../utils/backendUrl";
import { useAuth } from "./AuthContext";

const userContext = createContext();

export const UserDetailsProvider = ({ children }) => {
  const [userData, setUserData] = useState(null);
  const [userAddress, setUserAddress] = useState([]);
  const [selectedAddress, setSelectedAddress] = useState(null);
  const {isAuthenticated}= useAuth();

  const fetchUserDetails = async () => {
    try {
      const response = await axiosInstance.post(`${backendUrl}/api/user/profile`, {
        withCredentials: true,
      });

      if (response) {
        setUserData(response.data.user);
        setUserAddress(response.data.user.address || []);
      }
    } catch (error) {
      console.error("Failed to fetch user details:", error);
    }
  };

useEffect(() => {
  if (isAuthenticated && !userData) {
    fetchUserDetails();
  }
}, [isAuthenticated]);

  return (
    <userContext.Provider
      value={{
        userData,
        userAddress,
        selectedAddress,
        setSelectedAddress,
        fetchUserDetails,
      }}
    >
      {children}
    </userContext.Provider>
  );
};

export const useUserData = () => useContext(userContext);
