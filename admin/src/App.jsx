import React, { useEffect, useState } from 'react'
import Navbar from './components/Navbar'
import Sidebar from './components/Sidebar'
import { Route, Routes } from 'react-router-dom'
import Add from './pages/Add'
import ProductList from './pages/ProductList'
import Orders from './pages/Orders'
import Login from './components/Login'
import Coupon from './pages/Coupon'
import EditProduct from './pages/EditProduct'
import { FaRegCircleCheck } from "react-icons/fa6";


export const backendUrl = import.meta.env.VITE_BACKEND_URL

const App = () => {

  const [token, setToken] = useState(localStorage.getItem('token')?localStorage.getItem('token') : '');

  useEffect(()=>{
    localStorage.setItem('token',token);
  },[token])
  return (
  <div className="bg-gray-50 min-h-screen">
   

    {token === "" ? <Login setToken={setToken}/> : <>
   <Navbar setToken={setToken}/>
   <hr />
   <div className="flex w-full">
    <Sidebar/>

    

    <div className="w-full max-w-[900px]">
      <Routes>
        <Route path='/add' element={<Add token={token}/>} />
        <Route path='/allproducts' element={<ProductList/>} token={token}/>
        <Route path='/orders' element={<Orders/>} token={token}/>
        <Route path='/coupons' element={<Coupon token={token} />} />
        <Route path='/update' element={<EditProduct  />} /> 

      </Routes>
    </div>

   </div>
   </>

}
  </div>
  )
}

export default App