import React, { useEffect, useState } from 'react'
import { useAuth } from '../../context/AuthContext';
import {MdHome } from 'react-icons/md';
import { useCart } from '../../context/CartContext';
import { useUserData } from '../../context/UserContext';
import AddAddress from './AddAddress';
import EditAddress from './EditAddress';

import { MdEdit } from "react-icons/md";
import { IoMdTrash } from "react-icons/io";
// import { useUserData } from '../../context/UserContext';

const Address = () => {
   const {userAddress} = useUserData();

   const {cart}=useCart();
   
   const [openEdit, setOpenEdit]= useState(false);
   const [editData,setEditData] = useState({})
 
     useEffect(()=>{
      console.log(editData._id)

     },[openEdit])
       const [selectedAddressIndex, setSelectedAddressIndex] = useState('0');
 
         useEffect(() => {
   if (userAddress && selectedAddressIndex !== null) {
     const selectedAddress = userAddress[selectedAddressIndex];
     localStorage.setItem("selectedAddress", JSON.stringify(selectedAddress));
     localStorage.setItem("selectedAddressIndex", selectedAddressIndex.toString());
   }
 }, [userAddress, selectedAddressIndex]);
   return (
         <div className="flex flex-col mt-2 w-full">
   {/* Address Selection */}
          <h2 className="text-xl font-semibold mb-4">{userAddress.length > 1 ?`Addresses` : 'Address'}</h2>
          <div className='max-h-[150px] overflow-y-scroll !text-[9px] px-5 w-full'>
             
           {userAddress.length > 0 ? (
               <div className="flex flex-row flex-wrap gap-2 justify-center">
                 {userAddress.map((add, index) => (
                   <label
                     key={index}
                     className={`flex items-start p-2 border rounded-lg hover:shadow transition-all min-w-[180px] text-left flex-1 relative ${
                       selectedAddressIndex === index ? "border-blue-500" : "border-gray-200"
                     }`}
                   >
                     <input
                       type="radio"
                       name="selectedAddress"
                       value={index}
                       className="mt-1 mr-3 accent-blue-600 shadow-lg bg-white rounded-full cursor-pointer"
                       checked={selectedAddressIndex === index}
                       onChange={() => setSelectedAddressIndex(index)}
                     />
                     <div className='flex flex-col flex-wrap poppins items-start justify-start'>
                       <p className=" mb-1 flex items-center monst font-semibold bg-white p-[2px] rounded-full pr-2 -ml-1 ">
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

                     <div className="flex flex-col absolute top-3 right-3 gap-2 text-[12px]">
                      <button className='bg-black bg-opacity-90 text-white p-[4px] rounded-full ' onClick={()=>{setOpenEdit(true);
                         setEditData(add)}}>
                        <MdEdit/>
                        </button>
                      
                        <button className='bg-red-200 bg-opacity-90 text-red-700 p-[4px] rounded-full '>

  <IoMdTrash/>
                        </button>
                     </div>
                   </label>
                 ))}

                 {openEdit && <EditAddress close={()=>setOpenEdit(false)} data={editData} id={editData._id}/>}
               </div>
             ) : (
               <p className='monst font-semibold text-gray-400 tracking-wider'>No address found.</p>
             )}
 
 
 
 
           </div>
 
         </div>
 
   );
 };
export default Address