import { useState } from "react";
import Address from "../components/User/Address";
// import AddAddress from "../components/User/AddAddress";
import { useLocation, useNavigate } from "react-router-dom";
import { BiSolidOffer } from "react-icons/bi";
import { useUserData } from "../context/UserContext";
import axiosInstance from "../api/axiosInstance";
import { AiOutlineLoading3Quarters } from "react-icons/ai";
import { useCart } from "../context/CartContext";
import { toast } from "react-toastify";
import { FaBoxOpen, FaShippingFast, FaMoneyBillWave } from "react-icons/fa";
import { MdOutlinePayment } from "react-icons/md";
import { FaMoneyBillAlt } from "react-icons/fa";

const Checkout = () => {
  const navigate = useNavigate();

  const { refreshCart } = useCart();
  const location = useLocation();
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const { selectedAddress } = useUserData();

  const {
    total = 0,
    hasCoupon = false,
    itemCount = 0,
    cartList = [],
    coupon = null,
    delivery = 0,
  } = location.state || {};

  const [isCash, setIsCash] = useState(false);

  const handleProceed = () => {
    if (!selectedAddress) {
      toast.warn("Please select a delivery address", {
        position: "top-center",
      });
      return;
    }

    if (!isCash) {
      toast.warn("Please select a payment method", {
        position: "top-center",
      });
      return;
    }

    handleCashMethod();
  };

  const handleCashMethod = async () => {
    try {
      const payload = {
        itemList: cartList,
        address_id: selectedAddress._id,
        totalAmount: total,
        couponCode: coupon,
      };
     
      setLoading(true);
      const response = await axiosInstance.post(
        "/api/order/cash-on-delivery",
        payload,
        { withCredentials: true },  { timeout: 15000 }
      );

      if (response) {
        await refreshCart();
        setLoading(false);
        navigate("/my-orders");
      }

      if (!response) {
         setErrorMessage(response?.data?.message || response?.message || "Something went wrong");
        setLoading(false)
      }
    } catch (error) {
      toast.error(error?.response?.data?.message || error?.message || "Something went wrong");
      const message = error.response?.data?.message || error.message;
      setErrorMessage(message);
      setLoading(false)
    }
  };

  // const handleOnlineMethod = async ()=>{
  //   try {

  //   } catch (error) {

  //   }
  // }

  return (
    <section>
      {loading && (
        <div className=" fixed text-center text-white font-semibold inset-0 z-50 bg-blue-200 bg-opacity-50 flex justify-center items-center ">
          <div className="absolute flex justify-center items-center gap-4 bg-blue-600 p-4 text-white rounded top-[36%]">
            Processing Order. Please wait..{" "}
            <AiOutlineLoading3Quarters className="animate-spin" />
          </div>
        </div>
      )}

      <div className="flex flex-col-reverse sm:flex-row gap-6">
        {/* address */}
        <div className="flex flex-col items-center flex-1">

          <Address />

        </div>

        {/* summary details */}

        <div className="flex flex-1 flex-col gap-4">
          <h2 className="text-xl font-bold text-green-700 poppins">Checkout</h2>

          {/* Coupon Feedback */}
          <div className="px-6">
            {hasCoupon && (
              <p className="w-full bg-green-200 text-green-700 border border-green-400 rounded flex justify-between items-center p-2 font-semibold monst animate-fadeIn">
                COUPON Applied!{" "}
                <span>
                  <BiSolidOffer size={20} className="animate-pulse" />
                </span>
              </p>
            )}
          </div>

          {/* Price Summary */}
          <div className="flex flex-col justify-center px-6 gap-3 text-sm sm:text-base">
            <div className="bg-white border border-gray-200 shadow-sm rounded-lg overflow-hidden divide-y divide-gray-200">
              {/* Total Items */}
              <div className="flex items-center justify-between px-4 py-3 text-gray-800 font-medium bg-gray-50">
                <div className="flex items-center gap-2">
                  <FaBoxOpen className="text-blue-600" />
                  <span>Total Items</span>
                </div>
                <span className="font-semibold text-gray-700">{itemCount}</span>
              </div>

              {/* Delivery Fee */}
              <div className="flex items-center justify-between px-4 py-3 text-gray-800 font-medium">
                <div className="flex items-center gap-2">
                  <FaShippingFast className="text-teal-600" />
                  <span>Delivery Fee</span>
                </div>
                <span className="font-semibold text-gray-700">
                  ₹ {delivery}
                </span>
              </div>

              {/* Total Amount */}
              <div className="flex items-center justify-between px-4 py-3 text-gray-800 font-medium bg-yellow-50">
                <div className="flex items-center gap-2">
                  <FaMoneyBillWave className="text-yellow-600" />
                  <span>Total Amount</span>
                </div>
                <span className="font-bold text-yellow-800 text-lg">
                  ₹ {total}
                </span>
              </div>
            </div>
          </div>

          {/* Payment Methods */}
          <div className="flex flex-col items-center text-left mt-8 gap-3">
            <h2 className="text-left w-[90%] font-semibold poppins linkc text-lg">
              Choose Payment Method
            </h2>

            {/* Online Payment (Unavailable) */}
            <button
              disabled
              className="w-[90%] flex items-center gap-3 p-2 border border-gray-300 rounded text-left text-sm cursor-not-allowed bg-gray-100 text-gray-500 font-semibold relative"
              title="Currently unavailable"
            >
              <MdOutlinePayment size={20} />
              Online Payment
              <span className="ml-auto text-xs italic text-red-400">
                Unavailable
              </span>
            </button>

            {/* Cash On Delivery */}
            <label
              htmlFor="CashOnDelivery"
              className={`w-[90%] flex items-center gap-3 p-2 border rounded-sm transition-all text-sm cursor-pointer font-semibold ${
                isCash
                  ? "bg-green-100 text-green-700 border-green-400"
                  : "bg-white text-black"
              }`}
            >
              <input
                type="checkbox"
                id="CashOnDelivery"
                name="Cash"
                value="Cash"
                checked={isCash}
                onChange={(e) => setIsCash(e.target.checked)}
                className="accent-green-500 cursor-pointer"
              />
              <FaMoneyBillAlt size={18} />
              <span className="flex-1">Cash on Delivery</span>
              {isCash && (
                <span className="text-xs font-normal text-green-600">
                  Selected
                </span>
              )}
            </label>
          </div>

          {errorMessage && (
            <div className="text-red-600 text-sm bg-red-100 border border-red-400 px-3 py-2 rounded w-fit mx-auto">
              {errorMessage}
            </div>
          )}

          {/* Proceed Button */}
          <button
            className="bg-yellow-400 hover:bg-yellow-500 transition text-black font-semibold p-2 monst border border-yellow-500 rounded w-[90%] mx-auto mt-4"
            onClick={handleProceed}
          >
            Proceed To Pay
          </button>
        </div>
      </div>
    </section>
  );
};

export default Checkout;
