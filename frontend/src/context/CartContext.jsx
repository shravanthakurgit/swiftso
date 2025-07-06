import React, { createContext, useContext, useEffect, useState } from 'react';
import axiosInstance from '../api/axiosInstance';
import { useAuth } from './AuthContext';

const CartContext = createContext();
export const useCart = () => useContext(CartContext);

export const CartProvider = ({ children }) => {
  const LOCAL_CART_KEY = 'guest_cart';
  const [cart, setCart] = useState([]);
  const [loading, setLoading] = useState(true);
  const { isAuthenticated } = useAuth();

  
  const saveLocalCart = (items) => {
    localStorage.setItem(LOCAL_CART_KEY, JSON.stringify(items));
    setCart(items);
  };

 
  const fetchCart = async () => {
    if (isAuthenticated) {
      try {
        const res = await axiosInstance.get('/api/cart/get-cart', {
          withCredentials: true,
        });
        setCart(res.data.cart || []);
      } catch (error) {
        console.error('Failed to fetch cart:', error.message);
      } finally {
        setLoading(false);
      }
    } else {
      const storedCart = JSON.parse(localStorage.getItem(LOCAL_CART_KEY)) || [];
      setCart(storedCart);
      setLoading(false);
    }
  };

  
  useEffect(() => {
    const mergeGuestCart = async () => {
      const guestCart = JSON.parse(localStorage.getItem(LOCAL_CART_KEY));
      if (isAuthenticated && guestCart?.length > 0) {
        try {
          for (let item of guestCart) {
            await axiosInstance.post('/api/cart/add', item, { withCredentials: true });
          }
          localStorage.removeItem(LOCAL_CART_KEY);
        } catch (error) {
          console.error("Error can't push cart:", error.message);
        }
      }
      fetchCart();
    };

    mergeGuestCart();
  }, [isAuthenticated]);

  
  const addToCart = async (item) => {
    if (!isAuthenticated) {
      const existingCart = JSON.parse(localStorage.getItem(LOCAL_CART_KEY)) || [];
      const index = existingCart.findIndex(i => i.productId === item.productId && i.size === item.size);

      if (index > -1) {
        existingCart[index].quantity += item.quantity;
        existingCart[index].totalAmount = existingCart[index].quantity * existingCart[index].price;
      } else {
        existingCart.push({ ...item, totalAmount: item.price * item.quantity });
      }

      saveLocalCart(existingCart);
      return;
    }

    try {
      await axiosInstance.post('/api/cart/add', item, { withCredentials: true });
      await fetchCart();
    } catch (err) {
      console.error('Error adding to cart:', err.message);
    }
  };

  
  const removeFromCart = async (productId, size) => {
    if (!isAuthenticated) {
      const updatedCart = cart.filter(item => !(item.productId === productId && item.size === size));
      saveLocalCart(updatedCart);
      return;
    }

    try {
      await axiosInstance.delete('/api/cart/remove', {
        data: { productId, size },
        withCredentials: true,
      });
      await fetchCart();
    } catch (err) {
      console.error('Error removing from cart:', err.message);
    }
  };


  const updateCartItem = async (productId, size, quantity) => {
    if (!isAuthenticated) {
      const updatedCart = cart.map(item =>
        item.productId === productId && item.size === size
          ? { ...item, quantity, totalAmount: quantity * item.price }
          : item
      );
      saveLocalCart(updatedCart);
      return;
    }

    try {
      await axiosInstance.put(
        '/api/cart/update-quantity',
        { productId, size, quantity },
        { withCredentials: true }
      );
      await fetchCart();
    } catch (err) {
      console.error('Error updating cart item:', err.message);
    }
  };

  
  const clearCart = async () => {
    if (!isAuthenticated) {
      localStorage.removeItem(LOCAL_CART_KEY);
      setCart([]);
      return;
    }

    try {
      await axiosInstance.delete('/api/cart/clear', {
        withCredentials: true,
      });
      await fetchCart();
    } catch (err) {
      console.error('Error clearing cart:', err.message);
    }
  };

  return (
    <CartContext.Provider
      value={{
        cart,
        loading,
        addToCart,
        removeFromCart,
        updateCartItem,
        clearCart,
        refreshCart: fetchCart,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};
