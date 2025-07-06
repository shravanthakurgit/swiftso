import React, { useState } from "react";
import axios from "axios";
import {useNavigate } from "react-router-dom";
import { Eye, EyeOff } from "lucide-react"; // react-icon 

import { AiOutlineLoading3Quarters } from "react-icons/ai";
import { FaRegCircleCheck } from "react-icons/fa6";
import { useParams } from "react-router-dom";
import { useEffect } from "react";
import Error from "../../utils/Error";


export default function ResetPassword() {
  const backendUrl = process.env.REACT_APP_BACKEND_URL;
    let otp = localStorage.getItem("otp")
    let email = localStorage.getItem("otpEmail")
    const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const [isLoading, setIsLoading] = useState(false);
  const [isFinished, setIsFinished] = useState(false);

  const navigate = useNavigate();


  useEffect(()=>{
otp = localStorage.getItem("otp")
email = localStorage.getItem("otpEmail")
  },[])



  

 
  
 
  





  const onSubmitHandler = async (e) => {
    e.preventDefault();



    if (password !== confirmPassword) {
      setErrorMessage("Both Passwords do not match.");
      setTimeout(() => setErrorMessage(""), 3000);
      return;
    }

    const payload = {
      
      email,
      otp,
      newPassword: password,
      confirmPassword,
    };

  try {
  setIsLoading(true);

  const response = await axios.post(`${backendUrl}/api/user/reset-password`, payload, {
    withCredentials: true,
  });

  if(response){
    localStorage.removeItem("otpEmail")
    localStorage.removeItem("otp")
  }

  setIsFinished(true);
  setErrorMessage(""); // clear any previous error

  setTimeout(() => {
        navigate(`/login`)
      }, 1500);



} catch (error) {
  setIsLoading(false);
  setIsFinished(false);
  const message = error.response?.data?.message || error.message;
  setErrorMessage(message);
  setTimeout(() => setErrorMessage(""), 4000);
} finally {
  setIsLoading(false);
}

  };


  setTimeout(()=>{
localStorage.removeItem("otpEmail")
    localStorage.removeItem("otp")
  },600000)


  return (

    


    <div className="pb-6 flex items-start mt-6 justify-center px-4 py-2">



       {isLoading && (
        <div className=" fixed text-center text-white font-semibold inset-0 z-50 bg-black bg-opacity-80 flex justify-center items-center ">
          <div className="absolute flex justify-center items-center gap-4">Updating New Password. Please wait.. <AiOutlineLoading3Quarters className='animate-spin' /></div>
        </div>
      )}
      
          {isFinished && (
        <div className=" fixed text-center m-auto text-white font-semibold inset-0 z-50 bg-black bg-opacity-80 flex justify-center items-center ">
          <div className="absolute  flex justify-center items-center gap-4">New Password Updated. <FaRegCircleCheck /></div>
          <button onClick={()=>setIsFinished(false)} className='absolute top-[60%] p-3 border px-4 w-[250px]'>Close</button>
      
        </div>
      )}

      <div className="w-full max-w-sm bg-white rounded-md shadow-md p-6 space-y-6 border">
        <h2 className="text-2xl font-semibold text-gray-800 text-center">Set New Password</h2>

        <form className="space-y-4" onSubmit={onSubmitHandler}>
       



    

          <div className="relative">
            <label htmlFor="password" className="block text-sm font-medium text-gray-700 text-left">
              New Password <span className="text-sm text-red-600">*</span>
            </label>
            <input
              onChange={(e) => setPassword(e.target.value)}
              type={showPassword ? "text" : "password"}
              id="password"
              value={password}
              placeholder="••••••••"
              className="mt-1 block w-full rounded-md border border-gray-300 shadow-sm p-2 pr-10"
              required
            />
            <div
              className="absolute right-3 top-9 cursor-pointer"
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
            </div>
          </div>

          <div className="relative">
            <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 text-left">
              Confirm Password <span className="text-sm text-red-600">*</span>
            </label>
            <input
              onChange={(e) => setConfirmPassword(e.target.value)}
              type={showPassword ? "text" : "password"}
              id="confirmPassword"
              value={confirmPassword}
              placeholder="••••••••"
              className="mt-1 block w-full rounded-md border border-gray-300 shadow-sm p-2 pr-10"
              required
            />
          </div>

          {errorMessage && (
            <div className="text-red-600 text-sm bg-red-100 border border-red-400 px-3 py-2 rounded">
              {errorMessage}
            </div>
          )}

          <button
            type="submit"
            className="w-full bg-black text-white py-2 rounded-md hover:bg-indigo-700 transition duration-200"
          >
            Reset Password
          </button>
        </form>
      </div>
    </div>
  );
}
