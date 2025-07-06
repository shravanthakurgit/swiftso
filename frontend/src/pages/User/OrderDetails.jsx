import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import axiosInstance from "../../api/axiosInstance";
import { AiOutlineLoading3Quarters } from "react-icons/ai";

const OrderDetails = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const location = useLocation();

  const { orderId = null } = location.state || {};

  const fetchOrders = async () => {
    try {
      const response = await axiosInstance.post(
        "/api/order/get-order-details",
        { orderId },
        { withCredentials: true }
      );
      setOrders(response.data.order); 
    } catch (error) {
      console.error("Failed to fetch order:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = async ()=>{
      try {
         setLoading(true);
      const response = await axiosInstance.put(
        "/api/order/update-status",
        { orderId, status:"cancelled" },
        { withCredentials: true }
      );
  if(response){
    window.reload()
  }
    } catch (error) {
      console.error("Failed to fetch order:", error);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchOrders();
});

  if (loading) {
    return (
      <div className="fixed inset-0 z-50 bg-black bg-opacity-80 flex justify-center items-center text-white text-lg font-medium">
        Loading Order Details
        <AiOutlineLoading3Quarters className="ml-3 animate-spin" />
      </div>
    );
  }

  if (!orders || orders.length === 0) {
    return (
      <div className="text-center mt-20 text-gray-600 text-xl">
        No order details found.
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 p-4 md:p-10 space-y-6">
      {orders.map((item, index) => (
        <div
          key={index}
          className="max-w-4xl mx-auto bg-white shadow rounded-xl p-6 space-y-6"
        >
          <p className="text-xs text-left font-bold text-gray-800 border-b pb-2 flex justify-between gap-1 flex-wrap items-center ">
           <span> ORDER ID - {item.orderId}</span>
           <span className={`font-semibold monst text-green-600 capitalize tracking-wide text-left flex justify-center items-center gap-1 ${item.order_status !== 'delivered' ? "text-red-500":""}`}>
                  <span className="text-2xl -mt-[1.7px]">&#x2022;</span> {item.order_status}
                </span>
          </p>

          {/* Product Info */}
          <div className="flex flex-row flex-wrap text-left justify-start gap-4">
            
            <img
              src={item.product_details?.image}
              alt={item.product_details?.name}
              className="h-24 sm:w-40 sm:h-40 object-contain"
            />
           
            <div className="flex-1 space-y-1 font-semibold text-[10px] monst sm:text-sm">
               <h2 className="text-xs sm:text-sm font-semibold ">{item.product_details?.name}</h2>
              <p className="text-gray-600">Size : {item.product_details?.size}</p>
              <p className="text-gray-600">Quantity : {item.product_details?.quantity}</p>
              <p className="text-gray-600">
                Status :{" "}
                <span className="ml-2 font-semibold poppins text-green-600 capitalize tracking-wide">
                  {item.order_status}
                </span>
              </p>
              <p className="text-gray-600">
                Payment Method :{" "}
                <span className="ml-2  text-green-600 capitalize font-semibold monst">
                   {item.payment_Method}
                </span>
              </p>
            </div>
          </div>

          {/* Price Breakdown */}
          <div className="border-t pt-4 space-y-2 text-gray-800 poppins flex flex-col">
            <h3 className="text-lg font-semibold">Price Details</h3>
            <div className="flex justify-between">
              <span>Item Price</span>
              <span>₹{item.product_details?.price}</span>
            </div>
            <div className="flex justify-between">
              <span>Delivery Fee</span>
              <span>₹{item.product_details?.delivery_Fee}</span>
            </div>
            <div className="flex justify-between">
              <span>Platform Fee</span>
              <span>₹{item.product_details?.platform_Fee}</span>
            </div>
            {item.coupon_discount > 0 && (
              <div className="flex justify-between text-green-600">
                <span>Coupon Discount</span>
                <span>-₹{item.coupon_discount}</span>
              </div>
            )}
            <hr />
            <div className="flex justify-between font-bold text-lg">
              <span>Total Amount</span>
              <span>
                ₹
                {item.product_details?.totalAmount}
              </span>
              
            </div>
              {item.order_status === 'delivered' && <button className="p-1 bg-gray-200 px-6 border text-gray-600 rounded mr-auto !mt-10 monst">Return</button>}
{(item.order_status === 'pending' || item.order_status === 'placed') && (
  <button
    className="p-1 bg-gray-200 px-6 border text-gray-600 rounded mr-auto !mt-10 monst"
    onClick={handleCancel}
  >
    Cancel
  </button>
)}


             
          </div>

        
          
        </div>
      ))}
    </div>
  );
};

export default OrderDetails;
