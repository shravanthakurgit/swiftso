import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import { LikedProvider } from './context/LikedContext';
import { StoreProvider } from './context/StoreContext';
import { CartProvider } from './context/CartContext';
import { UserDetailsProvider } from './context/UserContext';
import { AuthProvider } from './context/AuthContext';





const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
 
  <StoreProvider>
     <AuthProvider>
    <CartProvider>
      <LikedProvider>
    <UserDetailsProvider>

     
<App />
   </UserDetailsProvider>
      </LikedProvider>
      </CartProvider>
         </AuthProvider>
      </StoreProvider>

);

reportWebVitals();