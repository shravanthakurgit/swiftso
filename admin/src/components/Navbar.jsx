import { FiMenu } from "react-icons/fi";
import { getCurrentUser } from "../utils/token";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";



const Navbar = ({ setToken, onMenuClick }) => {
   const user = getCurrentUser();

 const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("token");
    setToken("");
    setUser(null)
    window.location.reload();
    navigate("/login"); // or whatever your login route is
  };
  return (

user !== null ? (  <nav className="flex items-center justify-between p-4 bg-white shadow ">
      <div className="flex items-center gap-4">
        <button className="md:hidden" onClick={onMenuClick}>
          <FiMenu className="text-2xl" />
        </button>
        <h1 className="text-lg font-semibold">Admin Panel</h1>
        
        <div className="flex flex-wrap text-sm gap-6 flex-col">
<p><span className="font-semibold text-blue-600">Email: </span>{user?.email}</p>
<p className="capitalize"><span className="font-semibold text-blue-600">Role: </span> {user?.role}</p>
        </div>
        
      </div>

    <button
      onClick={handleLogout}
      className="text-sm bg-red-500 text-white px-3 py-1 rounded"
    >
      Logout
    </button>

    </nav>) : null

  
  );
};

export default Navbar;
