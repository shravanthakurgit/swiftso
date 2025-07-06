import { createContext, useState, useEffect} from "react";
import axiosInstance from "../api/axiosInstance";
import { useAuth } from "./AuthContext";

export const LikedContext = createContext();

export const LikedProvider = ({ children }) => {
  const [likedItems, setLikedItems] = useState({});
  const { isAuthenticated } = useAuth(); 


useEffect(() => {
  const fetchUserLikes = async () => {
    try {
      const res = await axiosInstance.get("/api/product/user-liked", {
        withCredentials: true,
      });

      const likedArray = res.data.likedProducts; 
      const mapped = {};

      for (const liked of likedArray) {
        mapped[liked.productId] = true;
      }

      setLikedItems(mapped);
      localStorage.setItem("likedItems", JSON.stringify(mapped));
    } catch (error) {
      console.error("Failed to fetch user liked products:", error);
    }
  };

  if (isAuthenticated) {
    fetchUserLikes();
  }
}, [isAuthenticated]);


  useEffect(() => {
    const stored = JSON.parse(localStorage.getItem("likedItems")) || {};
    setLikedItems(stored);
  },[]);


  useEffect(() => {
  const syncLikedItems = async () => {
    try {
      await axiosInstance.post('/api/product/sync-liked', { likedItems },{withCredentials:true});
     
    } catch (err) {
    return
    }
  };

  if (isAuthenticated && Object.keys(likedItems).length > 0) {
    syncLikedItems();
  }
}, [isAuthenticated,likedItems]);


  const toggleLike = async (productId) => {
    const updated = {
      ...likedItems,
      [productId]: !likedItems[productId],
    };

  
    setLikedItems(updated);
    localStorage.setItem("likedItems", JSON.stringify(updated));

   
    if (isAuthenticated) {
      try {
        await axiosInstance.post("/api/product/toggle-like", { productId },{withCredentials:true});
        console.log("Backend like toggled for:", productId);
      } catch (error) {
        console.error("Failed to toggle like on backend:", error);
      }
    }
  };

  return (
    <LikedContext.Provider value={{ likedItems, toggleLike }}>
      {children}
    </LikedContext.Provider>
  );
};
