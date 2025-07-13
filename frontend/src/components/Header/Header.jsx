"use client";
import { useState } from "react";
import { Dialog, DialogBackdrop, DialogPanel } from "@headlessui/react";
import {
  Bars3Icon,
  MagnifyingGlassIcon,
  ShoppingBagIcon,
  XMarkIcon,
} from "@heroicons/react/24/outline";
import { Link, NavLink, useNavigate } from "react-router-dom";

import { FaRegHeart, FaStore, FaUser } from "react-icons/fa";
import { RiHome5Fill } from "react-icons/ri";
import { BsFillBoxSeamFill } from "react-icons/bs";
import { useContext } from "react";
import { LikedContext } from "../../context/LikedContext";
import { useCart } from "../../context/CartContext";

import { MdAccountCircle } from "react-icons/md";
import { FaArrowRight } from "react-icons/fa6";
import { useToken } from "../../hooks/useToken";
import { useAuth } from "../../context/AuthContext";
import ConfirmAlert from "../../utils/ConfirmAlert";

const navigation = {
  pages: [
    { name: "HOME", href: "/", icon: RiHome5Fill },
    { name: "SHOP", href: "/shop", icon: FaStore },
    { name: "MY ORDERs", href: "/my-orders", icon: BsFillBoxSeamFill },
    { name: "LIKED", href: "/liked", icon: FaRegHeart },
  ],
};

const navigationlg = {
  pages: [
    { name: "HOME", href: "/", icon: RiHome5Fill },
    // { name: "MY ORDERs", href: "/my-orders", icon: BsFillBoxSeamFill },
    { name: "SHOP", href: "/shop", icon: FaStore },
    // { name: "MY ACCOUNT", href: "/my-account", icon: MdAccountCircle },
  ],
};

const userNavigation = {
  pages: [
    { name: "My Profile", href: "/my-account", icon: FaUser },
    { name: "MY ORDERs", href: "/my-orders", icon: BsFillBoxSeamFill },
    // { name: "MY ACCOUNT", href: "/my-account", icon: MdAccountCircle },
  ],
};

export default function Header() {
  const navigate = useNavigate();

  const { isAuthenticated, userData } = useAuth();
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const { cart } = useCart();

  const [open, setOpen] = useState(false);
  const [showLogoutAlert, setShowLogoutAlert] = useState(false);

  const setOpenDialog = () => {
    setOpen((prev) => !prev);
  };

  const handleLogout = () => {
    setShowLogoutAlert(false);
    navigate("/logout");
  };


const handleSearchClick = () => {
  navigate("/shop/?search");
  window.scrollTo({ top: 0, behavior: "smooth" }); // <-- this scrolls to top
};


  const { likedItems } = useContext(LikedContext);
  const totalLiked = Object.values(likedItems).filter(Boolean).length;

  return (
    <div className=" fixed top-0 z-50 w-[100%]">
      {showLogoutAlert && (
        <ConfirmAlert
          message=" Are you sure want to logout?"
          runFunction={handleLogout}
          hideAlert={() => setShowLogoutAlert(false)}
        />
      )}

      {/* Mobile menu */}
      <Dialog
        open={open}
        onClose={setOpen}
        className="relative z-50 lg:hidden transition-all duration-100"
        onClick={() => setOpen(false)}
      >
        <DialogBackdrop
          transition
          className="fixed inset-0 bg-black/25 transition-opacity duration-300 ease-linear data-closed:opacity-0 
          "
        />

        <div className="fixed inset-0 z-40 flex bg">
          <DialogPanel
            transition
            className="relative flex w-full max-w-xs transform flex-col overflow-y-auto bg-white pb-12 shadow-xl transition duration-300 ease-in-out data-closed:-translate-x-full -z-50"
          >
            <div className="flex px-4 pt-5 pb-2">
              <button
                type="button"
                onClick={() => setOpen(false)}
                className="relative -m-2 inline-flex items-center justify-center rounded-md p-2 text-gray-400"
              >
                <span className="absolute -inset-0.5" />
                <span className="sr-only">Close menu</span>
                <XMarkIcon aria-hidden="true" className="size-6" />
              </button>
            </div>

            <div className="space-y-4 py-6 px-4 flex flex-col">
              {navigation.pages.map((page) => (
                <NavLink
                  to={page.href}
                  className={({ isActive }) =>
                    ` border pr-5 flex-1 items-center rounded-full w-1/2 ${
                      isActive
                        ? "bg-[var(--primary)] font-semibold transition-all duration-500"
                        : ""
                    }`
                  }
                >
                  <div
                    key={page.name}
                    className="text-xs font-semibold text-black rounded-full px-1 pr-3 py-1 transition-all duration-500 flex  items-center gap-3  "
                    onClick={() => setOpen(false)}
                  >
                    <div className=" p-1 flex justify-center items-center rounded-full h-6 w-6 bg-white">
                      <page.icon className="text-sm" />
                    </div>
                    {page.name}
                  </div>
                </NavLink>
              ))}
            </div>

            {!isAuthenticated && (
              <div className="space-y-6 border-t border-gray-200 px-4 py-6 text-gray-500 font-medium">
                <Link to="/login">
                  <div
                    className="flow-root mb-2"
                    onClick={() => setOpen(false)}
                  >
                    Sign in
                  </div>
                </Link>

                <Link to="/register">
                  <div className="flow-root" onClick={() => setOpen(false)}>
                    Create account
                  </div>
                </Link>
              </div>
            )}
          </DialogPanel>
        </div>
      </Dialog>

      <header className="bg-white w-full !z-99999">
        <p className="flex h-10 items-center justify-center bg-indigo-600 px-4 text-sm font-medium text-white">
          Get free delivery on orders over ₹500
        </p>

        <nav
          aria-label="Top"
          className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 text-[var(--secondary)]  "
        >
          <div className="">
            <div className="flex h-16 items-center ">
              <button
                type="button"
                onClick={() => setOpen(true)}
                className="relative rounded-md  p-2 text-[var(--secondary)] md:hidden"
              >
                <span className=" absolute -inset-0.5" />
                <span className="sr-only">Open menu</span>
                <Bars3Icon aria-hidden="true" className="size-6 -ml-2" />
              </button>

              {/* Logo */}
              <div className=" ml-2 flex lg:ml-0 -mt-2 ">
                <Link to="/">
                  <span className="sr-only ">SwiftSo</span>
                  <div className="h-10 w-10 -mt- bg-[var(--primary)] block rounded-full backdrop-blur-lg "></div>
                  <div className="text-[0.5rem] -my-3 flex items-center rounded-full font-bold  px-2 z-999 relative p-0.5 right-1 backdrop-blur-lg ">
                    <p className="rubik tracking-wider"> SwiftSo</p>
                  </div>
                </Link>
              </div>

              <div className=" hidden md:flex px-4 gap-3 justify-center items-center mt-2">
                {navigationlg.pages.map((page) => (
                  <NavLink
                    key={page.name}
                    to={page.href}
                    className={({ isActive }) =>
                      `rounded-full  ${
                        isActive
                          ? "bg-[var(--primary)] transition-all duration-500"
                          : "border"
                      }`
                    }
                  >
                    <div
                      key={page.name}
                      className="text-[.7rem]  text-black rounded-full px-1 py-1 flex  items-center gap-1 pr-5 poppins font-semibold tracking-wide transition-all duration-1000"
                    >
                      <div className="text-sm p-1 flex justify-center items-center rounded-full h-6 w-6 bg-white">
                        <page.icon className=" transition-all duration-1000 " />
                      </div>
                      {page.name}
                    </div>
                  </NavLink>
                ))}
              </div>

              <div className="ml-auto flex items-center sm:gap-5">
                {/* Account */}

                <div className="relative">
                  <div
                    onClick={() => setDropdownOpen(!dropdownOpen)}
                    className="bg-white p-2 rounded-md"
                  >
                    {isAuthenticated ? (
                      <button className="bg-[var(--secondary)] rounded-full flex justify-center items-center w-8 h-8 pb-[0.3px] poppins font-semibold text-[var(--primary)] mt-1 ">
                        {userData.first_name?.charAt(0).toUpperCase()}
                      </button>
                    ) : (
                      <MdAccountCircle className="size-[2rem] text-gray-400 hover:text-gray-500 border rounded-full cursor-pointer" />
                    )}
                  </div>

                  {dropdownOpen && (
                    <div
                      className="fixed text-center text-white font-semibold inset-0 z-50 bg-black bg-opacity-5 flex justify-end  items-center right-0  top-5"
                      onClick={() => setDropdownOpen(!dropdownOpen)}
                    >
                      <div className="absolute right-20 sm:right-52 mr-2 top-20 mt-2 w-48 bg-[var(--primary)] poppins rounded shadow-lg z-50 border border-white transition-all">
                        {userNavigation.pages.map((page) => (
                          <NavLink
                            key={page.name}
                            to={page.href}
                            className="p-2  hover:bg-gray-50 flex items-center gap-2 rounded font-semibold text-[var(secondary)} py-4 border-b border-white text-sm  text-[var(--secondary)]"
                            onClick={() => setDropdownOpen(!dropdownOpen)}
                          >
                            <page.icon className="bg-[var(--secondary)] text-white rounded-full p-1 size-[20px] border border-white" />
                            {page.name}
                          </NavLink>
                        ))}

                        {isAuthenticated ? (
                          <button
                            onClick={() => setShowLogoutAlert(true)}
                            className="w-full text-left px-4 py-2 bg-[var(--secondary)] rounded text-white text-sm flex items-center gap-6  rounded-t-none rounded-r-none rounded-b"
                          >
                            Logout <FaArrowRight />
                          </button>
                        ) : (
                          <NavLink to="/login">
                            <button
                              onClick={() => setDropdownOpen(!dropdownOpen)}
                              className="w-full text-left px-4 py-2 bg-[var(--secondary)] rounded text-white text-sm flex items-center gap-6  rounded-t-none rounded-r-none rounded-b"
                            >
                              Login <FaArrowRight />
                            </button>
                          </NavLink>
                        )}
                      </div>
                    </div>
                  )}
                </div>

                {/* Liked */}

                <Link to="/liked">
                  <div className="relative bg-[var(--primary)] p-2 h-9 w-9 justify-center items-center rounded-full hidden sm:flex">
                    <span className="sr-only">Liked</span>
                    <FaRegHeart className="text-lg " />
                    <p className=" text-[var(--secondary)] absolute top-0  -right-1 bg-gray-600 rounded-full w-4 h-4 flex justify-center items-center text-[8px] text-white ">
                      {totalLiked}
                    </p>
                  </div>
                </Link>

                <div className="ml-auto flex items-center bg-[var(--primary)] px-[5px] rounded-md gap-2 p-1 ">
                  {/* Search */}
                  <div className="flex ml-1 bg-white rounded-full mr-1">
  <button
    onClick={handleSearchClick}
    className="p-1.5 text-[var(--secondary)] hover:text-gray-500"
  >
    <span className="sr-only">Search</span>
    <MagnifyingGlassIcon aria-hidden="true" className="size-4" />
  </button>
</div>


                  {/* Liked */}

                  {/* Cart */}
                  <NavLink
                    to="/cart"
                    className={({ isActive }) =>
                      ` ${
                        isActive
                          ? " !text-[var(--secondary)] font-semibold"
                          : ""
                      }`
                    }
                  >
                    <div className=" flow-root relative bg-white p-2  rounded-md ">
                      <p className="group  flex items-center">
                        <ShoppingBagIcon
                          aria-hidden="true"
                          className="size-[18px] shrink-0 group-hover:text-gray-500"
                        />
                        <span className=" w-4 h-4  flex justify-center items-center absolute right-0 top-0 bg-[var(--secondary)] rounded-full text-[8px] text-white pb-[0.5px]">
                          {cart?.reduce(
                            (total, item) => total + item.quantity,
                            0
                          )}
                        </span>
                        <span className="sr-only">items in cart, view bag</span>
                      </p>
                    </div>
                  </NavLink>
                </div>
              </div>
            </div>
          </div>
        </nav>
      </header>
    </div>
  );
}
