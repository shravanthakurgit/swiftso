import { QuestionMarkCircleIcon } from '@heroicons/react/24/outline';
import axios from 'axios';
import { ArrowBigRight, ArrowRightIcon, LogOut } from 'lucide-react';
import React, { useState, useEffect } from 'react';
import { FaCircleArrowRight, FaRegWindowRestore } from 'react-icons/fa6';
import { MdEmail, MdHome, MdPerson } from 'react-icons/md';
import {
  MdFavoriteBorder,
  MdShoppingBag,
  MdReplay,
  MdCreditCard,
  MdLocationOn,
  MdLocalOffer,
  MdLocalShipping,
  MdLiveHelp,
  MdHelp,
  MdSettings,
  MdLogout,
  MdEdit,
} from 'react-icons/md';
import { NavLink, useNavigate } from 'react-router-dom';
import Error from '../../utils/Error';
// import { useUserData } from '../../context/UserContext';
import { backendUrl } from '../../utils/backendUrl';
import { token } from '../../utils/Token';
import { useAuth } from '../../context/AuthContext';
 




const AccountOption = ({ icon: Icon, label }) => (
  <div className="flex items-center justify-between py-3 px-4 hover:bg-gray-50 cursor-pointer">
    <div className="flex items-center space-x-3">
      <Icon className="text-xl text-gray-600" />
      <span className="text-sm font-medium text-gray-800">{label}</span>
    </div>
    <span className="text-gray-400">{<FaCircleArrowRight/>}</span>
  </div>
);

const MyAccount = () => {

const {userData} = useAuth();
  const navigate = useNavigate()

  const [selectedAddressIndex, setSelectedAddressIndex] = useState('0');
  // const [userData, setUserData] = useState(null);
  const [showLogoutAlert, setShowLogoutAlert] = useState(false)



const handleLogout = ()=>{
navigate('/logout')
}

//   useEffect(() => {
//   if (userData?.address && selectedAddressIndex !== null) {
//     const selectedAddress = userData.address[selectedAddressIndex];
//     localStorage.setItem("selectedAddress", JSON.stringify(selectedAddress));
//     localStorage.setItem("selectedAddressIndex", selectedAddressIndex.toString());
//   }
// }, [userData, selectedAddressIndex]);


useEffect(() => {
const isOnline = navigator.onLine;
console.log("User is online?", isOnline); // true or false

  console.log("My Account Data", token)
  if (showLogoutAlert) {
    document.body.style.overflow = "hidden"; 
  } else {
    document.body.style.overflow = ""; 
  }

  
  return () => {
    document.body.style.overflow = "";
  };
}, [showLogoutAlert,token]);



  const selectedAddress = userData?.address?.[selectedAddressIndex];








  return (

userData && Object.keys(userData).length > 0 && token ?
  
  
  
  (
    
    
    <div className="flex flex-col max-w-lg mx-auto p-4 ">


      

<div className="bg-gradient-to-r from-blue-600 to-purple-400 text-white poppins p-4 text-sm">
        <p className="font-semibold">25% Summer discount</p>
        <p>Apply code <strong>SUMMER25</strong> on your next purchase</p>
      </div>

      
{/* Profile Info */}
      <div className="p-4 flex justify-between w-full">
        <div className='text-left'>
         <p className="text-lg font-semibold text-gray-900">
  Hi, {userData.first_name?.charAt(0).toUpperCase() + userData.first_name?.slice(1).toLowerCase()}
</p>

          <p className="text-sm text-gray-600">{userData.email}</p>
        </div>
        <button className="bg-gray-100 px-3 monst text-[10px] rounded shadow-sm flex items-center gap-1 max-h-[25px] font-semibold" onClick={()=> navigate('/update-user-details')}>
           Edit <MdEdit />
        </button>
      </div>

 <div className="mx-auto bg-white rounded-b shadow-md overflow-hidden mt-6 flex flex-col sm:flex-row w-full gap-1">
      {/* Header */}

      <div className='w-full'>


      {/* Section 1 */}
      <div className="divide-y border-b border-t">

<NavLink to='/liked'>
<AccountOption icon={MdFavoriteBorder} label="Wishlist" />
</NavLink>

<NavLink to='/my-orders'>
 <AccountOption icon={MdShoppingBag} label="Orders" />
</NavLink>

        
       
        <AccountOption icon={MdReplay} label="Returns" />
        <AccountOption icon={MdCreditCard} label="Billing" />

        <NavLink to='my-account/address'>
        
   
        <AccountOption icon={MdLocationOn} label="Address" />

        </NavLink>
        {/* <AccountOption icon={MdLocalOffer} label="Discounts" /> */}
      </div>


      </div>
      

      <div className="bg-gray-400 border "></div>



      <div className='w-full '>
{/* Section 2 */}
      <div className="divide-y border-b border-t ">
        {/* <AccountOption icon={MdLocalShipping} label="Shipping" /> */}
        <AccountOption icon={MdLiveHelp} label="FAQ" />
        <AccountOption icon={MdHelp} label="Help & Support" />
        <AccountOption icon={MdSettings} label="Settings" />
      </div>

    



      </div>

      


  {/* Logout */}

  
  



    </div>



  
      <div className="p-4 flex items-center justify-between text-red-600 hover:bg-gray-200 cursor-pointer bg-red-100  hover:text-gray-400" onClick={()=>setShowLogoutAlert(true)}>
        <div className="flex items-center gap-2 font-semibold">
           Logout
        </div>
        <span className="">{<MdLogout/>}</span>
      </div>




      {showLogoutAlert && (
              <div className="  fixed text-center m-auto text-white font-semibold inset-0 z-50 bg-black bg-opacity-30 flex justify-center items-center text-xs  ">
                <div className="absolute zoom-once flex-col flex justify-center items-center gap-4 bg-white p-4 rounded py-16 px-10">
                  
                  <div className="flex item-center gap-3 text-black justify-center">
 Are you sure want to Logout  <QuestionMarkCircleIcon className='size-[20px]'/>

                  </div>
                 
                
                <div className="flex gap-4 ">
  <button className=' text-slate-200 p-3 border w-32 rounded bg-slate-800' onClick={handleLogout} >Yes</button>
  <button className='p-3 w-32 rounded bg-red-200 text-red-600'  onClick={()=>setShowLogoutAlert(false)}>No</button>
</div>
                
                </div>

  
    </div>
      
  )}

      

  
    </div>)
    
    
    :
  
  
  
  
  (<Error message={!token ? 'Login First' : 'Network / Server Issue'} />
)



)

    
    

  // return (
  //   <div className="max-w-4xl mx-auto p-6 space-y-6">
  //     <h1 className=" font-bold text-gray-800 text-sm monst ">My Account</h1>

  //     {userData ? (
  //       <div className=' border rounded-md p-4 '>
  //         {/* User Info */}
  //         <div className="flex  items-center gap-4 p-4 shadow rounded-lg ">
  //           <div className="flex flex-wrap flex-col text-[15px] items-start poppins ">
  //             <MdPerson className="text-md text-blue-500" /> <p className="font-medium">{userData.first_name}</p>
               
  //             </div>

  //             <div className="grid grid-cols-2">
  //               <p className="text-gray-600 flex items-center">
  //               <MdEmail className="mr-1" />
  //               {userData.email}
  //             </p>

  //             <p className="text-gray-600 flex items-center">
  //               <MdEmail className="mr-1" />
  //               {userData.email}
  //             </p>
  //             <p className="text-gray-600 flex items-center">
  //               <MdEmail className="mr-1" />
  //               {userData.email}
  //             </p>
  //             <p className="text-gray-600 flex items-center">
  //               <MdEmail className="mr-1" />
  //               {userData.email}
  //             </p>
  //             </div>
           
  //         </div>



  //         {/* Address Selection */}
  //         <h2 className="text-xl font-semibold mb-4">{userData.address?.length > 1 ?`Addresses` : 'Address'}</h2>
  //         <div className='max-h-[150px] overflow-y-scroll !text-[9px] px-5'>
            
  //           {userData.address?.length > 0 ? (
  //             <div className="grid md:grid-cols-2 gap-2">
  //               {userData.address.map((add, index) => (
  //                 <label
  //                   key={index}
  //                   className={`flex items-start p-2 border rounded-lg cursor-pointer hover:shadow transition-all ${
  //                     selectedAddressIndex === index ? "border-blue-500" : "border-gray-200"
  //                   }`}
  //                 >
  //                   <input
  //                     type="radio"
  //                     name="selectedAddress"
  //                     value={index}
  //                     className="mt-1 mr-3 accent-blue-600 shadow-lg bg-white rounded-full"
  //                     checked={selectedAddressIndex === index}
  //                     onChange={() => setSelectedAddressIndex(index)}
  //                   />
  //                   <div className='flex flex-col flex-wrap poppins items-start justify-start'>
  //                     <p className=" mb-1 flex items-center monst font-semibold bg-white p-[2px] rounded-full pr-2">
  //                       <MdHome className="mr-1 linkc size-[16px] bg-white rounded-full p-[2px]" />
  //                       Address {index + 1}
  //                     </p>

  //                     <div className="flex flex-col items-start">

  //                       {add.name && <p className=" text-gray-700">{add.name}</p>}

  //                       {add.address && <p className=" text-gray-700">{add.address}</p>}

  //                     {add.city && <p className=" text-gray-500">{add.city}, {add.state}</p>}
  //                     {add.country && <p className=" text-gray-500">{add.country} - {add.pincode}</p>}
  //                     </div>
                      
  //                   </div>
  //                 </label>
  //               ))}
  //             </div>
  //           ) : (
  //             <p>No addresses found.</p>
  //           )}




  //         </div>

  
  //       </div>
  //     ) : (
  //       <p>Loading user data...</p>
  //     )}
  //   </div>
  // );
};

export default MyAccount;
