import React from 'react'
import { MdAdminPanelSettings } from "react-icons/md";
import { IoLogOutOutline } from "react-icons/io5";

const Navbar = ({setToken}) => {
  return (
    <div className='flex justify-between p-5 bg-white text-blue-500'>
        <div className="nabar flex gap-2 items-center "><MdAdminPanelSettings className="text-4x shadow-lg flex justify-center items-center w-8 h-8 rounded text-center"/><span className='font-semibold'>SwiftSo Admin</span>
        </div>

        <div className="logout bg-black text-white px-5 flex justify-center items-center text-center rounded-full gap-2 cursor-pointer hover:bg-gray-500 transition-all duration-200 " onClick={()=>setToken('')}><button className='pb-1' >Logout</button><IoLogOutOutline /></div>
    </div>
  )
}

export default Navbar