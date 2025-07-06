import React from 'react'
import { NavLink } from 'react-router-dom'
import { FiPlusCircle } from "react-icons/fi";
import { LuPackage } from "react-icons/lu";
import { LuShoppingBag } from "react-icons/lu";


const Sidebar = () => {
  return (
    <div className='w-[25%] min-h-screen border-r text-[15px] overflow-hidden '>
        
         <div className="additem flex flex-col items-start w-full bg-green-400 mt-3">
            <NavLink to='/add' className=' text-white flex items-center gap-3 p-2 justify-start w-full pl-5'>

            <FiPlusCircle className='text-4xl ' />

            <p className=' hidden font-semibold md:block'>Add Product</p>

            </NavLink>
            
        </div>
        <div className="additem flex flex-col items-start w-full bg-green-400 mt-3 ">
            <NavLink to='/allproducts' className=' text-white flex items-center gap-3 p-2 justify-start w-full pl-5'>

            <LuPackage className='text-4xl ' />

            <p className=' hidden font-semibold md:block'>All Products</p>

            </NavLink>
            
        </div>

        <div className="additem flex flex-col items-start w-full bg-green-400 mt-3">
            <NavLink to='/orders' className=' text-white flex items-center gap-3 p-2 justify-start w-full pl-5'>

            <LuShoppingBag className='text-4xl ' />

            <p className='font-semibold md:block hidden'>Orders</p>

            </NavLink>
            
        </div>

        <div className="additem flex flex-col items-start w-full bg-green-400 mt-3">
            <NavLink to='/coupons' className=' text-white flex items-center gap-3 p-2 justify-start w-full pl-5'>

            <LuShoppingBag className='text-4xl ' />

            <p className='font-semibold md:block hidden'>Coupons</p>

            </NavLink>
            
        </div>

    </div>
  )
}

export default Sidebar