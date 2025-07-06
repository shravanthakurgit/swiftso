import React, { useState } from 'react';
import axios from 'axios';
import { backendUrl } from '../App';
import { FaRegCircleCheck } from "react-icons/fa6";

const Coupon = ({ token }) => {
  const [form, setForm] = useState({
    code: '',
    discountType: 'percentage',
    buyAny : false,
    buyAnyPrice: '',
    maxCartQuantity: '',
    discountValue: '',
    minCartValue: '',
    expiresAt: '',
    usageLimit: '',
    perUserLimit: '',
  });

  const [message, setMessage] = useState('');

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm({ ...form, [name]: type === 'checkbox' ? checked : value });
  };

 const handleSubmit = async (e) => {
  e.preventDefault();

  try {
    const res = await axios.post(`${backendUrl}/api/coupons`, form, {
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
    });

    if (res) {

  const notification = document.getElementById("notification");
  notification.style.display = "block";

  // Optional: Hide it after a few seconds
  setTimeout(() => {
    notification.style.display = "none";
  }, 3000);


      
    }

    setMessage(`✅ Coupon created successfully.`);
  } catch (err) {
    setMessage(`❌ Error: ${err.response?.data?.message || 'Something went wrong'}`);
  }
};



  return (
    <div className="p-6 max-w-xl mx-auto bg-white shadow rounded-lg">

<div id="notification" className='fixed inset-0 bg-black bg-opacity-90 rounded-sm items-center justify-center text-white hidden'>

  <div className=' p-2 px-6 bg-green-600 rounded-sm flex items-center justify-center text-white animate-pingOnce ping-once absolute top-[40%]  right-[45%]'>Coupon added successfully <FaRegCircleCheck className='ml-4' />
 </div>
</div>

      <h2 className="text-xl font-bold mb-4">Create a New Coupon</h2>

      {message && <div className="mb-4 text-sm text-blue-600">{message}</div>}

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Coupon Code */}
        <div>
          <label htmlFor="code" className="block font-medium mb-1">Coupon Code</label>
          <input
            type="text"
            name="code"
            id="code"
            placeholder="COUPON2025"
            value={form.code}
            onChange={(e) =>
              handleChange({
                target: {
                  name: e.target.name,
                  value: e.target.value.toUpperCase(),
                },
              })
            }
            className="w-full p-2 border rounded uppercase"
            required
          />
        </div>

        {/* Discount Type */}
        <div>
          <label htmlFor="discountType" className="block font-medium mb-1">Discount Type</label>
          <select
            name="discountType"
            id="discountType"
            value={form.discountType}
            onChange={handleChange}
            className="w-full p-2 border rounded"
          >
            <option value="percentage">Percentage</option>
            <option value="fixed">Fixed Amount</option>
          </select>
        </div>

        {/* Buy Any Type */}
        <div>
          <label htmlFor="buyAny" className="block font-medium mb-1">Buy Any Type?</label>
          <select
            name="buyAny"
            id="buyAny"
            value={form.buyAny}
            onChange={handleChange}
            className="w-full p-2 border rounded"
          >
            <option value="false">No</option>
            <option value="true">Yes</option>
          </select>
        </div>



           {/* Discount Value */}
        <div>
          <label htmlFor="buyAnyPrice" className="block font-medium mb-1">Buy Any Offer Price</label>
          <input
            type="number"
            name="buyAnyPrice"
            id="buyAnyPrice"
            placeholder="Buy Any Price"
            value={form.buyAnyPrice}
            onChange={handleChange}
            className="w-full p-2 border rounded"
            required
          />
        </div>

        {/* Discount Value */}
        <div>
          <label htmlFor="discountValue" className="block font-medium mb-1">Discount Value</label>
          <input
            type="number"
            name="discountValue"
            id="discountValue"
            placeholder="Discount Value"
            value={form.discountValue}
            onChange={handleChange}
            className="w-full p-2 border rounded"
            required
          />
        </div>



        {/* Minimum Cart Value */}
        <div>
          <label htmlFor="minCartValue" className="block font-medium mb-1">Minimum Cart Value</label>
          <input
            type="number"
            name="minCartValue"
            id="minCartValue"
            placeholder="Minimum Cart Value"
            value={form.minCartValue}
            onChange={handleChange}
            className="w-full p-2 border rounded"
          />
        </div>


        <div>
          <label htmlFor="maxCartQuantity" className="block font-medium mb-1">Max Cart Quantity</label>
          <input
            type="number"
            name="maxCartQuantity"
            id="maxCartQuantity"
            placeholder="Max Cart Quantity"
            value={form.maxCartQuantity}
            onChange={handleChange}
            className="w-full p-2 border rounded"
          />
        </div>

        {/* Expiration Date */}
        <div>
           <label htmlFor="expiresAt" className="block font-medium mb-1">Expiration Date</label>
  <input
    type="datetime-local"
    name="expiresAt"
    id="expiresAt"
    value={form.expiresAt}
    onChange={handleChange}
    className="w-full p-2 border rounded"
    required
  />
        </div>

        {/* Usage Limit */}
        <div>
          <label htmlFor="usageLimit" className="block font-medium mb-1">Total Usage Limit</label>
          <input
            type="number"
            name="usageLimit"
            id="usageLimit"
            placeholder="Total Usage Limit"
            value={form.usageLimit}
            onChange={handleChange}
            className="w-full p-2 border rounded"
          />
        </div>

        {/* Per User Limit */}
        <div>
          <label htmlFor="perUserLimit" className="block font-medium mb-1">Per User Limit</label>
          <input
            type="number"
            name="perUserLimit"
            id="perUserLimit"
            placeholder="Per-User Limit"
            value={form.perUserLimit}
            onChange={handleChange}
            className="w-full p-2 border rounded"
            required
          />
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          Create Coupon
        </button>
      </form>
    </div>
  );
};

export default Coupon;
