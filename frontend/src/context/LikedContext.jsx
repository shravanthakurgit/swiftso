import { createContext, useState, useEffect, useRef } from "react";
import axiosInstance from "../api/axiosInstance";
import { useAuth } from "./AuthContext";

export const LikedContext = createContext();

export const LikedProvider = ({ children }) => {
  const [likedItems, setLikedItems] = useState({});
  const { isAuthenticated } = useAuth();
  const hasFetched = useRef(false); // to prevent double fetch on reload

  
  useEffect(() => {
    const stored = localStorage.getItem("likedItems");
    if (stored) {
      setLikedItems(JSON.parse(stored));
    }
  }, []);

  

    const fetchUserLikes = async () => {
      try {
        const res = await axiosInstance.post("/api/product/user-liked", {
          withCredentials: true,
        });

        const likedArray = res.data.likedProducts || [];
        const mapped = {};

        for (const liked of likedArray) {
          mapped[liked.productId] = true;
        }

        setLikedItems(mapped);
        localStorage.setItem("likedItems", JSON.stringify(mapped));
        hasFetched.current = true;
      } catch (error) {
        return
      }
    };

 
    const syncLikedItems = async () => {
      if (!isAuthenticated || Object.keys(likedItems).length === 0) return;

      try {
        await axiosInstance.post(
          "/api/product/sync-liked",
          { likedItems },
          { withCredentials: true }
        );
      } catch (err) {
      return
      }
    };

 
  const toggleLike = async (productId) => {
    const updated = {
      ...likedItems,
      [productId]: !likedItems[productId],
    };

    setLikedItems(updated);
    localStorage.setItem("likedItems", JSON.stringify(updated));

    if (isAuthenticated) {
      try {
        await axiosInstance.post(
          "/api/product/toggle-like",
          { productId },
          { withCredentials: true }
        );
      } catch (error) {
        console.error("Failed to toggle like on backend:", error);
      }
    }
  };

  return (
    <LikedContext.Provider value={{ likedItems,syncLikedItems, toggleLike,fetchUserLikes}}>
      {children}
    </LikedContext.Provider>
  );
};
