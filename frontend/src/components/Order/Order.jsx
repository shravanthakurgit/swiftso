import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axiosInstance from "../../api/axiosInstance";

const Order = () => {
  const [orders, setOrders] = useState([]);
  const navigate = useNavigate();

  const fetchOrder = async () => {
    try {
      const response = await axiosInstance.get("/api/order/get-orders", {
        withCredentials: true,
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
                      className="w-14 h-18 rounded-lg object-cover object-top"
                    />
                    <span className="text-sm font-medium text-gray-900 flex flex-wrap max-w-[250px] text-left">
                      {item.product_details?.name}
                    </span>
                  </div>
                </td>
                <td className="py-4 px-2 text-sm text-gray-700 text-left">{item.orderId}</td>
                <td className="py-4 px-4 text-left">
                  <span
                    className={`text-sm font-medium !text-left ${
                      item.order_status === "delivered"
                        ? "text-green-600"
                        : item.order_status === "cancelled"
                        ? "text-red-500"
                        : "text-gray-500"
                    }`}
                  >
                  {item.order_status.charAt(0).toUpperCase() + item.order_status.slice(1)}

                  </span>
                </td>
                {/* <td className="py-4 px-4 text-sm text-gray-700 text-left">
                  ₹ {item.product_details.price?.toFixed(2) || "0.00"}
                </td> */}
                <td className="py-4 px-4 text-right">
                  
                                <a
  href={item.invoice_receipt}
  download
  className="border border-gray-300 hover:bg-gray-100 text-[9px] font-semibold px-4 py-2 poppins rounded-full inline-block text-center"
>
  Show Invoice
</a>


                          <button
  onClick={()=>navigate('/order-details',{
    state: {
      orderId: item.orderId,
    }
  })}
  className="border border-gray-300 hover:bg-gray-100 text-[9px] font-semibold px-4 py-2 poppins rounded-full inline-block text-center mx-2 "
>
  View Details
</button>
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
                className="w-16 h-20 rounded-md object-cover object-top"
              />
              <div className="">
                <p className="text-sm font-medium text-gray-900 text-left sm:max-w-full flex flex-wrap">
                  {item.product_details?.name}
                </p>
                <p className="text-[10px] text-gray-500 text-left mt-2"> Order ID : {item.orderId}</p>
              </div>
            </div>

            <div className="flex justify-between text-sm monst">
              <span>Status:</span>
              <span
                className={`font-medium ${
                  item.status === "Delivered"
                    ? "text-green-600"
                    : item.status === "Cancelled"
                    ? "text-red-500"
                    : "text-gray-500"
                }`}
              >
                {item.order_status.charAt(0).toUpperCase() + item.order_status.slice(1)}

              </span>
            </div>

            {/* <div className="flex justify-between text-sm">
              <span>Price:</span>
              <span>₹ {item.product_details.price?.toFixed(2) || "0.00"}</span>
            </div> */}

            <div className="mt-2 text-right">
              {item.status === "Cancelled" ? (
                <button
                  onClick={() =>
                    navigate(`/product/${item.product_details?._id}`)
                  }
                  className="bg-indigo-600 hover:bg-indigo-700 text-white text-sm px-4 py-2 rounded-full"
                >
                  Buy Again
                </button>
              ) : (
               <a
  href={item.invoice_receipt}
  download
  className="border border-gray-300 hover:bg-gray-100 text-[9px] font-semibold px-4 py-1 poppins rounded-full inline-block text-center"
>
  Show Invoice
</a>



              )}

                      <button onClick={()=>navigate('/order-details',{
    state: {
      orderId: item.orderId,
    }
  })}
  className="border border-gray-300 hover:bg-gray-100 text-[9px] font-semibold px-4 py-1 poppins rounded-full inline-block text-center mx-2 "
>
  View Details
</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Order;
