import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from 'axios';
import { backendUrl } from "../App";
import { toast } from "react-toastify";
// import { getToken } from "../utils/token";



const Orders = ({token}) => {
  const [orders, setOrders] = useState([]);
  const navigate = useNavigate();
 
  const fetchOrder = async () => {
    try {
      const response = await axios.post(`${backendUrl}/api/order/admin-get-orders`,{},{
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });


      if (response?.data?.orderList) {
        setOrders(response.data.orderList);
      }
    } catch (error) {
      alert(error.message || "Error fetching orders");
    }
  };

  useEffect(() => {
    fetchOrder();
  }, []);

  const STATUS_OPTIONS = ['delivered', 'cancelled', 'pending', 'placed', 'returned', 'refunded'];

const handleStatusUpdate = async (orderId, newStatus) => {
  const confirm = window.confirm(`Are you sure you want to update this order to "${newStatus}"?`);
  if (!confirm) return;

  try {
  const response =  await axios.put(`${backendUrl}/api/order/admin-update-status`, {
      orderId,
      status: newStatus,
    }, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

     if (response?.data?.success) {
        toast.success(response?.data?.message || "Status Updated SuccessFully");
        setOrders((prev) =>
      prev.map((order) =>
        order.orderId === orderId ? { ...order, order_status: newStatus } : order
      )
    );
      } else {
        toast.error(response?.data?.message);
      }

    
  } catch (error) {
    alert("Failed to update status");
  }
};



  return (
    <div className="min-h-screen bg-white px-4 py-8 sm:px-6 lg:px-8">
      <h1 className="text-2xl font-bold mb-6 most">My Orders</h1>

      {/* Table View for md and up */}
      <div className="hidden md:block overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-100 text-left text-sm text-gray-500">
            <tr>
              <th className="py-3 px-4">Product</th>
              <th className="py-3 px-4">Order ID</th>
              <th className="py-3 px-4">Status</th>
              {/* <th className="py-3 px-4">Price</th> */}
              <th className="py-3 px-4 text-right pr-6 ">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {orders.map((item) => (
              <tr key={item._id} className="hover:bg-gray-50 transition">
                <td className="py-4 px-4">
                  
                  <div className="flex items-start gap-4">
                    <img 

                    
                      src={item.product_details?.image}
                      alt={item.product_details?.name}
                      className="w-14 h-18 rounded-lg object-cover object-top cursor-pointer"
                    />
                    <span 
                    
                    className="text-sm font-medium text-gray-900 flex flex-wrap max-w-[250px] text-left cursor-pointer  hover:underline">
                      {item.product_details?.name}
                    </span>
                  </div>
                </td>
                <td className="py-4 px-2 text-sm text-gray-700 text-left">{item.orderId}</td>


                <td className="py-4 px-4 text-left">
  <select
    value={item.order_status}
    onChange={(e) => handleStatusUpdate(item.orderId, e.target.value)}
    className="text-sm px-2 py-1 border rounded-md bg-white shadow-sm focus:outline-none"
  >
    {STATUS_OPTIONS.map((status) => (
      <option key={status} value={status}>
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </option>
    ))}
  </select>
</td>



                {/* <td className="py-4 px-4 text-sm text-gray-700 text-left">
                  ₹ {item.product_details.price?.toFixed(2) || "0.00"}
                </td> */}
                <td className="py-4 px-4 ">

                  <div className="flex items-center gap-4 justify-end flex-wrap">
                  
  <a
  href={item.invoice_receipt}
  download
  className="relative text-xs font-medium px-4 py-2 rounded-full group"
>
  <span className="absolute inset-0 border border-gray-200 rounded-full transition-all duration-300 group-hover:border-gray-300"></span>
  <span className="relative flex items-center justify-center gap-1 text-gray-600 group-hover:text-gray-800 transition-colors">
    <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
    </svg>
    Invoice
  </span>
</a>

<button
  onClick={() => navigate('/order-details', { state: { orderId: item.orderId } })}
  className="relative text-xs font-medium px-4 py-2 rounded-full overflow-hidden group"
>
  <span className="absolute inset-0 bg-gradient-to-r from-gray-800 to-gray-700 rounded-full transition-all duration-300 group-hover:from-gray-700 group-hover:to-gray-600"></span>
  <span className="relative flex items-center justify-center gap-1 text-white">
    <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
    </svg>
    Details
  </span>
</button>
</div>
                                
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Card View for small screens */}
      <div className="md:hidden space-y-4">
        {orders.map((item) => (
          <div
            key={item.orderId}
            className="bg-white border rounded-xl shadow-sm p-4 flex flex-col gap-3"
          >
            <div className="flex items-start gap-4">
              <img
              
                src={item.product_details?.image}
                alt={item.product_details?.name}
                className="w-16 h-20 rounded-md object-cover object-top cursor-pointer"
              />
              <div className="">
                <p 
                
                className="text-sm font-medium text-gray-900 text-left sm:max-w-full flex flex-wrap cursor-pointer hover:underline">
                  {item.product_details?.name}
                </p>
                <p className="text-[10px] text-gray-500 text-left mt-2"> Order ID : {item.orderId}</p>
              </div>
            </div>

            <div className="flex gap-2 text-sm monst">


              <span>Status:</span>
             <select
  value={item.order_status}
  onChange={(e) => handleStatusUpdate(item.orderId, e.target.value)}
  className="text-xs px-2 py-1 border rounded-md bg-white shadow-sm focus:outline-none"
>
  {STATUS_OPTIONS.map((status) => (
    <option key={status} value={status}>
      {status.charAt(0).toUpperCase() + status.slice(1)}
    </option>
  ))}
</select>



            </div>

           

                      <div className="flex items-center gap-4 justify-end flex-wrap">
                  
  <a
  href={item.invoice_receipt}
  download
  className="relative text-xs font-medium px-4 py-2 rounded-full group"
>
  <span className="absolute inset-0 border border-gray-200 rounded-full transition-all duration-300 group-hover:border-gray-300"></span>
  <span className="relative flex items-center justify-center gap-1 text-gray-600 group-hover:text-gray-800 transition-colors">
    <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
    </svg>
    Invoice
  </span>
</a>

<button
  onClick={() => navigate('/order-details', { state: { orderId: item.orderId } })}
  className="relative text-xs font-medium px-4 py-2 rounded-full overflow-hidden group"
>
  <span className="absolute inset-0 bg-gradient-to-r from-gray-800 to-gray-700 rounded-full transition-all duration-300 group-hover:from-gray-700 group-hover:to-gray-600"></span>
  <span className="relative flex items-center justify-center gap-1 text-white">
    <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
    </svg>
    Details
  </span>
</button>
</div>


          </div>
        ))}
      </div>
    </div>
  );
};

export default Orders;
