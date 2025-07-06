// import logo from "./logo.svg";
import "./App.css";
// import { ThemeProvider } from "@material-tailwind/react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import HomePage from "./pages/HomePage/HomePage";
import ProductDetails from "./components/ProductDetail/ProductDetails";
import Header from "./components/Header/Header";
import Footer from "./components/Footer/Footer";
import Store from "./components/Store/Store";
import LikedItems from "./components/LikedProducts/LikedItems";
import Order from "./components/Order/Order";
import Cart from "./components/Cart/Cart";
import MyAccount from "./components/User/MyAccount";
import Login from "./pages/User/Login";
import VerifyEmail from "./pages/VerifyEmail";
import {ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import SignUp from "./pages/User/Signup";
import ForgotPassword from "./pages/User/ForgotPassword";
import VerifyOTP from "./pages/User/VerifyOTP";
import ResetPassword from "./pages/User/ResetPassword";
import Logout from "./pages/User/Logout";
import ProductSearch from "./components/SerachProduct/Search";
import PrivateRoute from "./PrivateRoute";
import { useAuth } from "./context/AuthContext";
import { useEffect } from "react";
import { setupInterceptors } from "./api/axiosInstance";
import UpdateUser from "./pages/User/Profile/UpdateUser";
import Checkout from "./pages/Checkout";
import OrderDetails from "./pages/User/OrderDetails";
import Address from "./components/User/Address";


function App() {

    const { setIsAuthenticated } = useAuth();

  useEffect(() => {
    setupInterceptors(setIsAuthenticated);
  }, [setIsAuthenticated]);

  
  return (
    <div className="App">
      <ToastContainer />
      <BrowserRouter>
        <Header />
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/store" element={<Store />} />
          <Route
            path="/liked/product-details/:productCategory/:productName"
            element={<ProductDetails />}
          />
          <Route
            path="/store/product-details/:productCategory/:productName"
            element={<ProductDetails />}
          />
          <Route path="/liked" element={
             <PrivateRoute>
 <LikedItems />
            </PrivateRoute>
            
            
            } />
               <Route path="/order-details" element={
             <PrivateRoute>
 < OrderDetails/>
            </PrivateRoute>
            
            
            } />
          <Route path="/my-orders" element={
            <PrivateRoute>
  <Order />
            </PrivateRoute>
          
            
            } />
          <Route path="/cart" element={
            //  <PrivateRoute>
   <Cart />
            // </PrivateRoute> 
          
            
            } />
          <Route
            path="/my-account"
            element={
              <PrivateRoute>
                <MyAccount />
              </PrivateRoute>
            }
          />

          <Route
            path="/update-user-details"
            element={
              <PrivateRoute>
                <UpdateUser/>
              </PrivateRoute>
            }
          />

             <Route
            path="/checkout"
            element={
              <PrivateRoute>
                <Checkout/>
              </PrivateRoute>
            }
          />

             <Route
            path="/my-account/address"
            element={
              <PrivateRoute>
                <Address/>
              </PrivateRoute>
            }
          />

          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<SignUp />} />
          <Route path="/verify-email" element={<VerifyEmail />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/verify-otp" element={<VerifyOTP />} />
          <Route path="/reset-password" element={<ResetPassword />} />
          <Route path="/logout" element={
   <Logout />
           
            
            } />
          <Route path="/search" element={<ProductSearch />} />
        </Routes>
        <Footer />
      </BrowserRouter>
    </div>
  );
}

export default App;
