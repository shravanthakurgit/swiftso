import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { AiOutlineLoading3Quarters } from "react-icons/ai";
import { FaRegCircleCheck } from "react-icons/fa6";

export default function ForgotPassword() {
  const backendUrl = process.env.REACT_APP_BACKEND_URL;
  const navigate = useNavigate();

  const [email, setEmail] = useState("");

  const [errorMessage, setErrorMessage] = useState("");

  const [isLoading, setIsLoading] = useState(false);
  const [isFinished, setIsFinished] = useState(false);

  const onSubmitHandler = async (e) => {
    e.preventDefault();

    const payload = {
      // first_name: firstName,
      // last_name: lastName,
      email,
      //   password,
    };

    try {
      setIsLoading(true);

      const response = await axios.post(
        `${backendUrl}/api/user/forgot-password`,
        payload,
        {
          withCredentials: true,
        }
      );


       if (response.data.success) {
               localStorage.setItem("otpEmail", email);
        setIsFinished(true);
      setErrorMessage(response?.data?.message);
      setTimeout(()=>{
  navigate(`/verify-otp`);
      },4000)

            } else {
              setErrorMessage(response?.data?.message);
            }

    
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

  return (
    <div className=" flex items-start mt-10 justify-center px-4 pb-6">
      {isLoading && (
        <div className=" fixed text-center text-white font-semibold inset-0 z-50 bg-black bg-opacity-80 flex justify-center items-center ">
          <div className="absolute flex justify-center items-center gap-4">
            Sending OTP. Please wait..{" "}
            <AiOutlineLoading3Quarters className="animate-spin" />
          </div>
        </div>
      )}

      {isFinished && (
        <div className=" fixed text-center m-auto text-white font-semibold inset-0 z-50 bg-black bg-opacity-80 flex justify-center items-center ">
          <div className="absolute  flex justify-center items-center gap-4">
            OTP Sent To Your Email (also check spam folder) <FaRegCircleCheck />
          </div>
          <button
            onClick={() => setIsFinished(false)}
            className="absolute top-[60%] p-3 border px-4 w-[250px]"
          >
            Close
          </button>
        </div>
      )}

      <div className="w-full max-w-sm bg-white rounded-md shadow-md p-6 space-y-6 border">
        <h2 className="font-semibold text-gray-800 text-center text-md monst ">
          Email For OTP
        </h2>

        <form className="space-y-4" onSubmit={onSubmitHandler}>
          <div>
            <label
              htmlFor="email"
              className="block text-sm font-medium text-gray-700 text-left"
            >
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

          {errorMessage && (
            <div className="text-red-600 text-sm bg-red-100 border border-red-400 px-3 py-2 rounded">
              {errorMessage}
            </div>
          )}

          <button
            type="submit"
            className="w-full bg-black text-white py-2 rounded-md hover:bg-indigo-700 transition duration-200"
          >
            Send OTP
          </button>
        </form>
      </div>
    </div>
  );
}
