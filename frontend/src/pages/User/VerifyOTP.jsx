import React, { useEffect, useState } from "react";
import axios from "axios";
import { AiOutlineLoading3Quarters } from "react-icons/ai";
import { FaRegCircleCheck } from "react-icons/fa6";
import { useNavigate } from "react-router-dom";

export default function VerifyOTP() {
  const backendUrl = process.env.REACT_APP_BACKEND_URL;
  const navigate = useNavigate();

  // ✅ Store email in state
  const [email, setEmail] = useState(() => localStorage.getItem("otpEmail") || "");
  const [otp, setOTP] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isFinished, setIsFinished] = useState(false);

  // Optional: Keep it in sync if needed (rarely necessary)
  useEffect(() => {
    const storedEmail = localStorage.getItem("otpEmail");
    if (storedEmail) setEmail(storedEmail);
  }, []);

  const onSubmitHandler = async (e) => {
    e.preventDefault();
    const payload = { otp, email };

    try {
      setIsLoading(true);
      const response = await axios.post(
        `${backendUrl}/api/user/verify-otp`,
        payload,
        { withCredentials: true }
      );

      if (response) {
        localStorage.setItem("otp", otp);
      }
      setIsFinished(true);
      setErrorMessage("");

      setTimeout(() => {
        navigate(`/reset-password`);
      }, 1500);
    } catch (error) {
      const message = error.response?.data?.message || error.message;
      setErrorMessage(message);
      setTimeout(() => setErrorMessage(""), 4000);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="pb-6 flex items-start mt-6 justify-center px-4 py-2">
      {/* Loading */}
      {isLoading && (
        <div className="fixed inset-0 bg-black bg-opacity-80 z-50 flex items-center justify-center text-white font-semibold">
          <div className="flex gap-4">
            Verifying OTP. Please wait..
            <AiOutlineLoading3Quarters className="animate-spin" />
          </div>
        </div>
      )}

      {/* Success */}
      {isFinished && (
        <div className="fixed inset-0 bg-black bg-opacity-80 z-50 flex flex-col items-center justify-center text-white font-semibold">
          <div className="flex items-center gap-4">
            OTP Verified <FaRegCircleCheck />
          </div>
          <button
            onClick={() => setIsFinished(false)}
            className="mt-6 border px-4 py-3 w-[250px]"
          >
            Close
          </button>
        </div>
      )}

      <div className="w-full max-w-sm bg-white rounded-md shadow-md p-6 space-y-6 border">
        <h2 className="text-md font-semibold text-gray-800 text-center monst">
          Enter YOUR OTP
        </h2>

        <form className="space-y-4" onSubmit={onSubmitHandler}>
          <div>
            <label htmlFor="otp" className="block text-sm font-medium text-gray-700 text-left">
              OTP <span className="text-sm text-red-600">*</span>
            </label>
            <input
              onChange={(e) => setOTP(e.target.value)}
              type="text"
              id="otp"
              value={otp}
              placeholder="Enter OTP"
              className="mt-1 block w-full rounded-md border border-gray-300 shadow-sm p-2"
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
            Verify OTP
          </button>
        </form>
      </div>
    </div>
  );
}
