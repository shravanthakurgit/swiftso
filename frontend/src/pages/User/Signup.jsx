import React, { useState } from "react";
import axios from "axios";
import { NavLink, useNavigate } from "react-router-dom";
import { Eye, EyeOff, MailCheck } from "lucide-react"; 
import { AiOutlineLoading3Quarters } from "react-icons/ai";
import { FaRegCircleCheck } from "react-icons/fa6";
import { useEffect } from "react";
import { backendUrl } from "../../utils/backendUrl";


export default function SignUp() {
  const navigate = useNavigate();
 

  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const [isLoading, setIsLoading] = useState(false);
  const [isSignuped, setIsSignuped] = useState(false);

  const token = localStorage.getItem("accessToken");

  useEffect(()=>{
  window.scrollTo({ top: 0, behavior: 'smooth' });

  
     
  },[])


  useEffect(() => {
     
      if (token) {
        navigate("/");
      }
    }, [token, navigate]);

  const onSubmitHandler = async (e) => {
    e.preventDefault();



    if (password !== confirmPassword) {
      setErrorMessage("Passwords do not match.");
      setTimeout(() => setErrorMessage(""), 3000);
      return;
    }

    const payload = {
      first_name: firstName,
      last_name: lastName,
      email,
      password,
    };

  try {
  setIsLoading(true);

  const response = await axios.post(`${backendUrl}/api/user/register`, payload, {
    withCredentials: true,
  });


  

  // const message = response?.data?.message || "User registered successfully";
  setIsSignuped(true);
  setErrorMessage("");
  
  await new Promise((resolve) => {
  setTimeout(() => {
    setIsSignuped(true);
    resolve();
  }, 5000);
});

if(response){
    const { accessToken, refreshToken } = response.data.tokens;



localStorage.setItem("accessToken", accessToken);
localStorage.setItem("refreshToken", refreshToken);

  }

  navigate("/"); 
} catch (error) {
  setIsLoading(false);
  setIsSignuped(false);
  const message = error.response?.data?.message || error.message;
  setErrorMessage(message);
  setTimeout(() => setErrorMessage(""), 4000);
} finally {
  setIsLoading(false);
}

  };

  return (

    


    <div className="pb-6 flex items-start mt-6 justify-center px-4 py-2">



       {isLoading && (
        <div className=" fixed text-center text-white font-semibold inset-0 z-50 bg-black bg-opacity-50 flex justify-center items-center ">
          <div className="absolute flex justify-center items-center gap-4 bg-green-600 p-6 rounded-md  border border-white ">Registering. Please wait.. <AiOutlineLoading3Quarters className='animate-spin' /></div>
        </div>
      )}
      
          {isSignuped && (
        <div className=" fixed text-center m-auto text-white font-semibold inset-0 z-50 bg-black bg-opacity-80 flex justify-center items-center ">
          <div className="absolute  flex justify-center items-center gap-4 ">Registered SuccessFully  <FaRegCircleCheck /></div>

          <div className=" flex items-center  gap-3  px-4 absolute top-[32%] bg-green-500 border p-2 rounded-md"><p >A verification email sent to you. </p><MailCheck className="size-[20px] ping-once"/></div>

          <button onClick={()=>{navigate("/"); setIsSignuped(false)}} className='absolute top-[60%] p-1 border px-4 w-[150px] rounded-full monst text-xs'>Close</button>
      
        </div>
      )}

      <div className="w-full max-w-sm bg-white rounded-md shadow-md p-6 border space-y-6">
        <h2 className="monst font-semibold text-gray-800 text-center text-md">New User? Register</h2>

        <form className="space-y-4" onSubmit={onSubmitHandler}>
          <div>
            <label htmlFor="firstName" className="block text-sm font-medium text-gray-700 text-left">
              First Name <span className="text-sm text-red-600">*</span>
            </label>
            <input
              onChange={(e) => setFirstName(e.target.value)}
              type="text"
              id="firstName"
              value={firstName}
              className="mt-1 block w-full rounded-md border border-gray-300 shadow-sm p-2"
              required
            />
          </div>

          <div>
            <label htmlFor="lastName" className="block text-sm font-medium text-gray-700 text-left">
              Last Name
            </label>
            <input
              onChange={(e) => setLastName(e.target.value)}
              type="text"
              id="lastName"
              value={lastName}
              className="mt-1 block w-full rounded-md border border-gray-300 shadow-sm p-2"
            />
          </div>

          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700 text-left">
              Email <span className="text-sm text-red-600">*</span>
            </label>
            <input
              onChange={(e) => setEmail(e.target.value)}
              type="email"
              id="email"
              value={email}
              placeholder="you@example.com"
              className="mt-1 block w-full rounded-md border border-gray-300 shadow-sm p-2"
              required
            />
          </div>

          <div className="relative">
            <label htmlFor="password" className="block text-sm font-medium text-gray-700 text-left">
              Password <span className="text-sm text-red-600">*</span>
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
            Sign-Up
          </button>
        </form>

        <div className="flex text-xs gap-2"><p>Already have an account ?</p><NavLink to="/login"><span className="font-semibold monst linkc">Login Here</span></NavLink></div>
        
      </div>
       
       
    </div>
  );
}
