import { createContext, useContext, useEffect, useState } from 'react';
import axiosInstance from '../api/axiosInstance';

const StoreContext = createContext();

export const StoreProvider = ({ children }) => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);


  useEffect(() => {
    const cached = localStorage.getItem('storeProducts');
    if (cached) {
      setProducts(JSON.parse(cached));
      setLoading(false); 
    } else {
      fetchProducts(); 
    }
  }, []);

  const fetchProducts = async () => {
    setLoading(true);
    try {
      const response = await axiosInstance.post(`/api/product/list`);
      setProducts(response.data.products);
      // localStorage.setItem('storeProducts', JSON.stringify(response.data.products));
    } catch (err) {
      setError(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <StoreContext.Provider value={{ products, loading, error, refreshProducts: fetchProducts }}>
      {children}
    </StoreContext.Provider>
  );
};

export const useStore = () => useContext(StoreContext);
