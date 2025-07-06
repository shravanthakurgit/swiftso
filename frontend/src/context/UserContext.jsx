import { createContext, useContext, useEffect, useState } from "react";
import axiosInstance from "../api/axiosInstance";
import { backendUrl } from "../utils/backendUrl";
import { token } from "../utils/Token";

const userContext = createContext();

export const UserDetailsProvider = ({ children }) => {
  const [userData, setUserData] = useState([]);
  const [userAddress, setUserAddress] = useState([]);
  const [selectedAddress, setSelectedAddress] = useState(null);

  const fetchUserDetails = async () => {
    try {
      const response = await axiosInstance.get(`${backendUrl}/api/user/profile`, {
        withCredentials: true,
      });

      if (response) {
        setUserData(response.data.user);
        setUserAddress(response.data.user.address);
      }
    } catch (error) {
      console.error("Failed to fetch user details:", error);
    }
  };

  useEffect(() => {
    fetchUserDetails();
  }, [token]);

  return (
    <userContext.Provider value={{ userData, userAddress, fetchUserDetails, setSelectedAddress,selectedAddress }}>
      {children}
    </userContext.Provider>
  );
};

export const useUserData = () => useContext(userContext);
