import React from "react";
import { NavLink } from "react-router-dom";
import { FiPlus } from "react-icons/fi";
import { LuPackage, LuClipboardList, LuTicket, LuListChecks, LuX } from "react-icons/lu";

const links = [
  { to: "/add", label: "Add Product", icon: <FiPlus className="text-xl" /> },
  { to: "/allproducts", label: "All Products", icon: <LuPackage className="text-xl" /> },
  { to: "/orders", label: "Orders", icon: <LuClipboardList className="text-xl" /> },
  { to: "/coupons", label: "Create Coupon", icon: <LuTicket className="text-xl" /> },
  { to: "/admin/all-coupons", label: "List Coupons", icon: <LuListChecks className="text-xl" /> },
  { to: "/users", label: "Users", icon: <LuListChecks className="text-xl" /> },
];

const Sidebar = ({ isOpen, onClose }) => {
  return (
    <>
      {/* Overlay */}
      {isOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-40 z-30 md:hidden" onClick={onClose}></div>
      )}

      <div className={`
        fixed top-0 left-0 z-40 h-full w-64 bg-white shadow transform transition-transform duration-300 ease-in-out
        ${isOpen ? "translate-x-0" : "-translate-x-full"} 
        md:relative md:translate-x-0 md:block md:w-[22%]
      `}>
        <div className="flex justify-between items-center p-4 md:hidden">
          <span className="text-lg font-bold">Menu</span>
          <button onClick={onClose}>
            <LuX className="text-2xl" />
          </button>
        </div>

        <nav className="flex flex-col gap-2 p-4">
          {links.map(({ to, label, icon }) => (
            <NavLink
              key={to}
              to={to}
              onClick={onClose}
              className={({ isActive }) =>
                `flex items-center gap-3 px-3 py-2 rounded hover:bg-green-100 transition ${
                  isActive ? "bg-green-200 font-semibold" : "text-gray-700"
                }`
              }
            >
              {icon}
              <span>{label}</span>
            </NavLink>
          ))}
        </nav>
      </div>
    </>
  );
};

export default Sidebar;
