import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import axiosInstance from "../../api/axiosInstance";
import { AiOutlineLoading3Quarters } from "react-icons/ai";
import { FiBox,FiMapPin, FiX, FiCheck } from "react-icons/fi";
import ConfirmAlert from "../../utils/ConfirmAlert";
import { slugify } from "../../utils/slugify";
import { toast } from "react-toastify";

const OrderDetails = () => {
  const navigate = useNavigate();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const location = useLocation();
  const [showAlert, setShowAlert] = useState(false);
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
      toast.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = async () => {
    try {
      setLoading(true);
      const response = await axiosInstance.put(
        "/api/order/update-status",
        { orderId, status:"cancelled" },
        { withCredentials: true }
      );
      if(response) {
        window.location.reload();
      }
    } catch (error) {
      console.error("Failed to fetch order:", error);
    } finally {
      setLoading(false);
      setShowAlert(false);
    }
  }

  useEffect(() => {
    fetchOrders();
  }, []);

  if (loading) {
    return (
      <div className="fixed inset-0 z-50 bg-black/80 flex flex-col justify-center items-center gap-3 text-white">
        <AiOutlineLoading3Quarters className="animate-spin text-2xl" />
        <p className="text-lg font-medium">Loading Order Details</p>
      </div>
    );
  }

  if (!orders || orders.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4">
        <FiBox className="text-4xl text-gray-400" />
        <p className="text-gray-500 text-lg">No order details found</p>
      </div>
    );
  }

  const getStatusColor = (status) => {
    switch(status) {
      case 'delivered': return 'bg-green-100 text-green-700';
      case 'cancelled':
      case 'returned':
      case 'refunded': return 'bg-red-100 text-red-700';
      default: return 'bg-yellow-100 text-yellow-700';
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-8">
      {orders.map((item, index) => (
        <div key={index} className="max-w-4xl mx-auto bg-white rounded-xl shadow-sm overflow-hidden">
          {/* Order Header */}
          <div className="p-6 border-b border-gray-100">
            <div className="flex justify-between items-center">
              <h2 className=" text-xs sm:text-sm font-semibold text-gray-800 text-left">ORDER ID: {item.orderId}</h2>
              <span className={`px-3 py-1 rounded-full text-xs font-medium uppercase ${getStatusColor(item.order_status)}`}>
                {item.order_status}
              </span>
            </div>
          </div>

          {/* Product Card */}
          <div className="p-6 border-b border-gray-100">
            <div className="flex flex-col sm:flex-row gap-5">
              <img 
                onClick={() => navigate(`/shop/product-details/order/${slugify(`${item.product_details.name}`)}/?id=${item.productId}`)}
                src={item.product_details?.image}
                alt={item.product_details?.name}
                className="w-24 h-24 sm:w-32 sm:h-32 object-contain cursor-pointer transition-all"
              />
              
              <div className="flex-1 space-y-2">
                <h3 
                  onClick={() => navigate(`/shop/product-details/order/${slugify(`${item.product_details.name}`)}/?id=${item.productId}`)}
                  className="font-medium text-gray-800 hover:text-blue-600 cursor-pointer transition-colors text-left"
                >
                  {item.product_details?.name}
                </h3>
                
                <div className="flex flex-wrap flex-col gap-x-4 gap-y-2 text-sm text-gray-600">
                  <div className="flex items-center gap-1">
                    <span>Size :</span>
                    <span className="font-medium">{item.product_details?.size}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <span>Qty :</span>
                    <span className="font-medium">{item.product_details?.quantity}</span>
                  </div>
                </div>
                
                <div className="flex items-center gap-1 text-sm">
                  <span className="text-gray-600">Payment Method :</span>
                  <span className=" text-blue-600 capitalize font-semibold">{item.payment_Method}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Price Breakdown */}
          <div className="p-6 border-b border-gray-100">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">Price Details</h3>
            <div className="space-y-3 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-600">Item Price</span>
                <span className="font-medium">₹{item.product_details?.price}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Discount</span>
                <span className="font-medium text-green-600">-₹{item.product_details?.discount}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Delivery</span>
                <span className="font-medium">₹{item.product_details?.delivery_Fee}</span>
              </div>
              {item.coupon_discount > 0 && (
                <div className="flex justify-between">
                  <span className="text-gray-600">Coupon Discount</span>
                  <span className="font-medium text-green-600">-₹{item.coupon_discount}</span>
                </div>
              )}
              <div className="border-t border-gray-100 pt-3 mt-2 flex justify-between font-semibold text-gray-800">
                <span>Total Amount</span>
                <span>₹{item.product_details?.totalAmount}</span>
              </div>
            </div>
          </div>

          {/* Delivery Address */}
          <div className="p-6 border-b border-gray-100">
            <div className="flex items-center gap-2 text-gray-800 mb-3">
              <FiMapPin className="text-gray-400" />
              <h3 className="font-semibold">Delivery Address</h3>
            </div>
            <div className="space-y-1 text-sm text-gray-600 text-left">
              <p className="font-medium text-gray-800">{item.deliver_address.name}</p>
              <p>{item.deliver_address.address}</p>
              {item.deliver_address.address_2 && <p>{item.deliver_address.address_2}</p>}
              {item.deliver_address.landmark && <p>Near {item.deliver_address.landmark}</p>}
              <p>{item.deliver_address.city}, {item.deliver_address.state}</p>
              <p>{item.deliver_address.country} - {item.deliver_address.pincode}</p>
            </div>
          </div>

          {/* Actions */}
          <div className="p-6 flex flex-wrap gap-3">
            {(item.order_status === 'pending' || item.order_status === 'placed') && (
              <button
                onClick={() => setShowAlert(true)}
                className="px-5 py-2.5 bg-white border border-gray-200 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 hover:border-gray-300 transition-colors flex items-center gap-2"
              >
                <FiX className="text-red-500" />
                Cancel Order
              </button>
            )}
            {item.order_status === 'delivered' && (
              <button className="px-5 py-2.5 bg-white border border-gray-200 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 hover:border-gray-300 transition-colors flex items-center gap-2">
                <FiCheck className="text-green-500" />
                Request Return
              </button>
            )}
          </div>

          {showAlert && (
            <ConfirmAlert 
              message="Are you sure you want to cancel this order?"
              hideAlert={() => setShowAlert(false)} 
              runFunction={handleCancel}
            />
          )}
        </div>
      ))}
    </div>
  );
};

export default OrderDetails;