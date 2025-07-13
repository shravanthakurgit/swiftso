import { useEffect, useState } from 'react';
import Navbar from './components/Navbar';
import Sidebar from './components/Sidebar';
import { Route, Routes } from 'react-router-dom';
import Add from './pages/Add';
import ProductList from './pages/ProductList';
import Orders from './pages/Orders';
import Login from './components/Login';
import Coupon from './pages/Coupon';
import EditProduct from './pages/EditProduct';
import OrderDetails from './pages/AdminOrderDetails.jsx';
import AdminAllCoupons from './components/AdminAllCoupons.jsx';
import AdminEditCoupon from './components/AdminEditCoupon.jsx';
import {ToastContainer } from "react-toastify";
import UserList from './components/User/UserList.jsx';



export const backendUrl = import.meta.env.VITE_BACKEND_URL;

const App = () => {
  const [token, setToken] = useState(localStorage.getItem('token') || '');
  const [isSidebarOpen, setSidebarOpen] = useState(false); 

  useEffect(() => {
    localStorage.setItem('token', token);
  }, [token]);

  if (token === "") return <Login setToken={setToken} />;

  return (
    <div className="bg-gray-50 min-h-screen">
        <ToastContainer />
      <Navbar setToken={setToken} onMenuClick={() => setSidebarOpen(!isSidebarOpen)} />
      <hr />

      <div className="flex w-full">
        {/* Sidebar - hidden on small, visible on medium+ */}
        <Sidebar isOpen={isSidebarOpen} onClose={() => setSidebarOpen(false)} />

        <div className="w-full max-w-[900px] mx-auto p-4">
          <Routes>
            <Route path='/add' element={<Add token={token} />} />
            <Route path='/allproducts' element={<ProductList token={token}  />} />
            <Route path='/orders' element={<Orders token={token}/>} />
            <Route path='/coupons' element={<Coupon token={token} />} />
            <Route path='/update' element={<EditProduct token={token} />} />
            <Route path='/order-details' element={<OrderDetails token={token} />} />
            <Route path='/admin/all-coupons' element={<AdminAllCoupons token={token} />} />
            <Route path='/admin/edit-coupon/:id' element={<AdminEditCoupon  token={token}/>} />
            <Route path='/users' element={<UserList token={token}/>} />
          </Routes>
        </div>
      </div>
    </div>
  );
};

export default App;
