import { useContext, useState } from "react";
import axios from "axios";
import { NavLink, useNavigate } from "react-router-dom";
import { Eye, EyeOff } from "lucide-react";
import { AiOutlineLoading3Quarters } from "react-icons/ai";
import { FaRegCircleCheck } from "react-icons/fa6";
import { useEffect } from "react";
import { useAuth } from "../../context/AuthContext";
import { LikedContext } from "../../context/LikedContext";
import Loading from "../../utils/Loading";

export default function Login() {
  const { isAuthenticated, setIsAuthenticated } = useAuth();
  const backendUrl = process.env.REACT_APP_BACKEND_URL;
  const navigate = useNavigate();

  const { fetchUserLikes, syncLikedItems } = useContext(LikedContext);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [showPassword, setShowPassword] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const [isLoading, setIsLoading] = useState(false);
  const [isSignuped, setIsSignuped] = useState(false);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, []);

  useEffect(() => {
    if (isAuthenticated) {
      navigate("/");
    }
  }, [isAuthenticated, navigate]);

  const onSubmitHandler = async (e) => {
    e.preventDefault();

    const payload = {
      // first_name: firstName,
      // last_name: lastName,
      email,
      password,
    };

    try {
      setIsLoading(true);

      const response = await axios.post(
        `${backendUrl}/api/user/login`,
        payload,
        {
          withCredentials: true,
        }
      );

      if (response) {
        await syncLikedItems();
        await fetchUserLikes();
        const { accessToken } = response.data.tokens;

        setIsAuthenticated(true);
        localStorage.setItem("accessToken", accessToken);

        navigate("/");
        window.location.reload();
      }

      // const message = response?.data?.message || "User Login successfull ";
      setIsSignuped(true);
      setErrorMessage("");
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
    <div className=" pb-6 flex items-start mt-6 justify-center px-4 py-2">
      {isLoading && (
        <Loading message="Loging in. Please wait.."/>
      )}

      {isSignuped && (
        <div className=" fixed text-center m-auto text-white font-semibold inset-0 z-50 bg-black bg-opacity-80 flex justify-center items-center ">
          <div className="absolute  flex justify-center items-center gap-4">
            Login SuccessFull <FaRegCircleCheck />
          </div>
          <button
            onClick={() => setIsSignuped(false)}
            className="absolute top-[60%] p-3 border px-4 w-[250px]"
          >
            Close
          </button>
        </div>
      )}

      <div className="w-full max-w-sm bg-white rounded-md shadow-md p-6 space-y-6 border ">
        <h2 className="font-semibold text-gray-800 text-center monst text-md ">
          Login
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

          <div className="relative">
            <label
              htmlFor="password"
              className="block text-sm font-medium text-gray-700 text-left"
            >
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

          <div className="ml-auto poppins text-xs flex items-center justify-end p-1 mt-2">
            <NavLink to="/forgot-password">
              <span className="linkc">Frogot Password?</span>
            </NavLink>
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
            Login
          </button>
        </form>

        <div className="flex text-xs gap-2">
          <p>Don't have an account ?</p>
          <NavLink to="/register">
            <span className="font-semibold monst linkc">
              Register a NEW Account
            </span>
          </NavLink>
        </div>
      </div>
    </div>
  );
}
