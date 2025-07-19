import React, { useState } from "react";
import axios from 'axios';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { backendUrl } from "../App";
import { getCurrentUser } from "../utils/token";

const adminUrl = import.meta.env.VITE_ADMIN_URL;

export default function Login({ setToken }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const user = getCurrentUser();

  const onSubmitHandler = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(`${backendUrl}${adminUrl}`, { email, password });
      

      if (response.data.success) {
        window.location.reload();
        setToken(response.data.token);
        toast.success("Login successful!");
      } else {
        toast.error(response.data.message || "Login failed.");
      }
    } catch (error) {
      console.error(error);
      toast.error(error.response?.data?.message || error.message || "An error occurred.");
    }
  };
  
return (
  user === null ? (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4">
      <ToastContainer />
      <div className="w-full max-w-sm bg-white rounded-md shadow-md p-6 space-y-6">
        <h2 className="text-2xl font-semibold text-gray-800 text-center">Admin Panel Login</h2>

        <form className="space-y-4" onSubmit={onSubmitHandler}>
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700">
              Email
            </label>
            <input
              onChange={(e) => setEmail(e.target.value)}
              type="email"
              id="email"
              name="email"
              value={email}
              placeholder="you@example.com"
              className="mt-1 block w-full rounded-md border border-gray-300 shadow-sm p-2 focus:border-indigo-500 focus:ring-indigo-500 focus:outline-none"
              required
            />
          </div>

          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-700">
              Password
            </label>
            <input
              onChange={(e) => setPassword(e.target.value)}
              type="password"
              id="password"
              name="password"
              value={password}
              placeholder="••••••••"
              className="mt-1 block w-full rounded-md border border-gray-300 shadow-sm p-2 focus:border-indigo-500 focus:ring-indigo-500 focus:outline-none"
              required
            />
          </div>

          <button
            type="submit"
            className="w-full bg-black text-white py-2 rounded-md hover:bg-indigo-700 transition duration-200"
          >
            Login
          </button>
        </form>
      </div>
    </div>
  ) : null
);

 
}
