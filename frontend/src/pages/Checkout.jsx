import React, { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import {MdHome, MdPerson } from 'react-icons/md';
import Address from "../components/User/Address";
import AddAddress from "../components/User/AddAddress";
import { useLocation } from "react-router-dom";
import { BiSolidOffer } from "react-icons/bi";


const Checkout = () => {

    const {userData} = useAuth()
const location = useLocation();

    const { total = 0, discount = 0, hasCoupon = false, itemCount=0 } = location.state || {};

//       const [selectedAddressIndex, setSelectedAddressIndex] = useState('0');

//         useEffect(() => {
//   if (userData?.address && selectedAddressIndex !== null) {
//     const selectedAddress = userData.address[selectedAddressIndex];
//     localStorage.setItem("selectedAddress", JSON.stringify(selectedAddress));
//     localStorage.setItem("selectedAddressIndex", selectedAddressIndex.toString());
//   }
// }, [userData, selectedAddressIndex]);
  return (
    <section>
      <div className="flex flex-col-reverse sm:flex-row gap-6">


        {/* address */}
        <div className="flex flex-col items-center flex-1">

            <AddAddress/>

  {/* Address Selection */}
         {/* <h2 className="text-xl font-semibold mb-4">{userData.address?.length > 1 ?`Addresses` : 'Address'}</h2> */}

         <Address/>



         {/* <div className='max-h-[150px] overflow-y-scroll !text-[9px] px-5'>
            
          {userData.address?.length > 0 ? (
              <div className="grid md:grid-cols-2 gap-2">
                {userData.address.map((add, index) => (
                  <label
                    key={index}
                    className={`flex items-start p-2 border rounded-lg cursor-pointer hover:shadow transition-all ${
                      selectedAddressIndex === index ? "border-blue-500" : "border-gray-200"
                    }`}
                  >
                    <input
                      type="radio"
                      name="selectedAddress"
                      value={index}
                      className="mt-1 mr-3 accent-blue-600 shadow-lg bg-white rounded-full"
                      checked={selectedAddressIndex === index}
                      onChange={() => setSelectedAddressIndex(index)}
                    />
                    <div className='flex flex-col flex-wrap poppins items-start justify-start'>
                      <p className=" mb-1 flex items-center monst font-semibold bg-white p-[2px] rounded-full pr-2">
                        <MdHome className="mr-1 linkc size-[16px] bg-white rounded-full p-[2px]" />
                        Address {index + 1}
                      </p>

                      <div className="flex flex-col items-start">

                        {add.name && <p className=" text-gray-700">{add.name}</p>}

                        {add.address && <p className=" text-gray-700">{add.address}</p>}

                      {add.city && <p className=" text-gray-500">{add.city}, {add.state}</p>}
                      {add.country && <p className=" text-gray-500">{add.country} - {add.pincode}</p>}
                      </div>
                      
                    </div>
                  </label>
                ))}
              </div>
            ) : (
              <p>No addresses found.</p>
            )}




          </div> */}

        </div>

        {/* summary details */}
        <div className="flex flex-1 flex-col gap-2">
     <h2 className="text-lg font-bold poppins text-green-700">Checkout</h2>

     <div className="flex flex-col text-left justify-center px-6 gap-2">
      {hasCoupon &&  <p className="w-full bg-green-200 flex justify-between px-6 text-green-600 p-2 items-center monst rounded border border-green-400 font-semibold zoom-once">COUPON Applied ! <span> <BiSolidOffer size={20} className="animate-pulse text-green-700"/> </span></p>}

        <p className="flex justify-between px-6 bg-black bg-opacity-10 monst font-semibold p-2 rounded text-black">Total Items : <span>{itemCount}</span></p>

    <p className="flex justify-between px-6 bg-black bg-opacity-10 monst font-semibold p-2  rounded text-black">Total Amount: <span>₹ {total}</span></p>
    
     </div>
     
<button className="bg-[var(--primary)] p-2 monst font-semibold border border-yellow-500 rounded-sm mt-4 w-[90%] mx-auto">Proceed To Pay</button>
        </div>


      </div>
    </section>
  );
};

export default Checkout;
