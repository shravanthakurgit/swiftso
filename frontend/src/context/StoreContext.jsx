import React, { createContext, useContext, useEffect, useState } from 'react';
import axios from 'axios';
import { backendUrl } from '../utils/backendUrl';
import axiosInstance from '../api/axiosInstance';

const StoreContext = createContext();

export const StoreProvider = ({ children }) => {


  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);



  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await axiosInstance.get(`/api/product/list`);
        setProducts(response.data.products);
      } catch (err) {
        setError(err);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  return (
    <StoreContext.Provider value={{ products, loading, error }}>
      {children}
    </StoreContext.Provider>
  );
};

export const useStore = () => useContext(StoreContext);
