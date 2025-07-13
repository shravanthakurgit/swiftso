import { useState, useEffect } from "react";
import { useAuth } from "../../../context/AuthContext";
import axiosInstance from "../../../api/axiosInstance";
// import { FiEye, FiEyeOff } from "react-icons/fi";
import { useNavigate } from "react-router-dom";
import ConfirmAlert from "../../../utils/ConfirmAlert";

const UpdateUser = () => {
  const { userData } = useAuth();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    first_name: "",
    last_name: "",
    gender: "",
  });

  // const [showPassword, setShowPassword] = useState(false);
  const [showAlert, setShowAlert] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [isSuccess, setIsSuccess] = useState(false);

  useEffect(() => {
    if (userData) {
      setFormData({
        first_name: userData.first_name || "",
        last_name: userData.last_name || "",
        email: userData.email || "",
        mobile: userData.mobile || "",
        gender: userData.gender || "",
        // password: userData.password || ''
      });
    }
  }, [userData]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axiosInstance.put(
        "/api/user/update-user",
        formData,
        { withCredentials: true }
      );
      setShowAlert(false);
      setErrorMessage(response.data.message);
      setIsSuccess(true);
    } catch (error) {
      setShowAlert(false);
      setErrorMessage("Something went wrong!");
      setIsSuccess(false);
    }
  };

  return (
    <div className="max-w-md mx-auto mt-10 p-6 bg-white shadow-xl rounded-2xl border">
      {showAlert ? (
        <ConfirmAlert
          message="Are Confirm Updating Profile?"
          runFunction={handleSubmit}
          hideAlert={() => setShowAlert(false)}
        />
      ) : null}

      <h2 className="text-2xl font-bold mb-6 text-gray-800 monst">
        Edit Profile
      </h2>

      <div className="space-y-5 text-left">
        {/* First Name */}
        <div>
          <label className="block mb-1 text-sm font-medium text-gray-700">
            First Name :
          </label>
          <input
            type="text"
            name="first_name"
            value={formData.first_name}
            onChange={handleChange}
            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
          />
        </div>

        {/* Last Name */}
        <div>
          <label className="block mb-1 text-sm font-medium text-gray-700">
            Last Name :
          </label>
          <input
            type="text"
            name="last_name"
            value={formData.last_name}
            onChange={handleChange}
            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
          />
        </div>

        {/* Gender */}
        <div>
          <label className="block mb-1 text-sm font-medium text-gray-700">
            Gender :
            <select
              className="w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm bg-white text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-400 mt-1"
              name="gender"
              value={formData.gender}
              onChange={handleChange}
            >
              <option value="" disabled>
                {userData?.gender?.charAt(0).toUpperCase() +
                  userData?.gender?.slice(1) || "Select Gender"}
              </option>
              <option value="male">Male</option>
              <option value="female">Female</option>
              <option value="other">Other</option>
            </select>
          </label>
        </div>

        {/* Email (disabled) */}
        <div>
          <label className="block mb-1 text-sm font-medium text-gray-700">
            Email :
          </label>
          <input
            type="email"
            name="email"
            value={formData.email}
            disabled
            className="w-full px-4 py-2 border rounded-lg bg-gray-100 text-gray-500 cursor-not-allowed"
          />
        </div>

        {/* Mobile */}
        <div>
          <label className="block mb-1 text-sm font-medium text-gray-700">
            Mobile :
          </label>
          <input
            type="text"
            name="mobile"
            value={formData.mobile}
            onChange={handleChange}
            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
          />
        </div>

        {/* Password Update */}
        <div>
          <label className="block mb-1 text-sm font-medium">
            Want to change your password?{" "}
            <span
              className="linkc cursor-pointer"
              onClick={() => navigate("/forgot-password")}
            >
              Click Here
            </span>
          </label>
          {/* <div className="relative">
            <input
              type={showPassword ? 'text' : 'password'}
              name="password"
              value={formData.password}
              onChange={handleChange}
              className="w-full px-4 py-2 border rounded-lg pr-10 focus:outline-none focus:ring-2 focus:ring-blue-400"
            />
            <span
              onClick={() => setShowPassword(prev => !prev)}
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 cursor-pointer"
            >
              {showPassword ? <FiEyeOff size={20} /> : <FiEye size={20} />}
            </span>
          </div> */}
        </div>

        {/* Submit Button */}
        {errorMessage && (
          <div
            className={` text-center px-3 py-2 rounded zoom-once ${
              isSuccess
                ? "text-green-600 bg-green-200 border border-green-400"
                : "text-red-600 text-sm bg-red-100 border border-red-400 "
            }`}
          >
            {errorMessage}
          </div>
        )}

        {/* Submit Button */}
        {isSuccess ? (
          <button
            type="button"
            className="w-full bg-red-500 text-white py-2 rounded-sm hover:bg-red-400 transition monst font-semibold"
            onClick={() => {
              navigate("/my-account");
              setTimeout(() => window.location.reload(), 100);
            }}
          >
            Close
          </button>
        ) : (
          <button
            type="button"
            className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition"
            onClick={() => setShowAlert(!showAlert)}
          >
            Update Profile
          </button>
        )}
      </div>
    </div>
  );
};

export default UpdateUser;
