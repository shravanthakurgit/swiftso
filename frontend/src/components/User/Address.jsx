import { useEffect, useState } from "react";
import { MdHome } from "react-icons/md";
import { useUserData } from "../../context/UserContext";
import EditAddress from "./EditAddress";
import { MdEdit } from "react-icons/md";
import { IoMdTrash } from "react-icons/io";
import ConfirmAlert from "../../utils/ConfirmAlert";
import { toast } from "react-toastify";
import axiosInstance from "../../api/axiosInstance";


const Address = () => {
  const { userAddress, selectedAddress, setSelectedAddress,fetchUserDetails } = useUserData();
  const [openEdit, setOpenEdit] = useState(false);
  const [editData, setEditData] = useState({});
  const [showAlert, setShowAlert]=useState(false)
  const [addressId, setAddressId] = useState(null)



  const [selectedAddressIndex, setSelectedAddressIndex] = useState(null);

  //   useEffect(() => {
  //   const savedIndex = localStorage.getItem('selectedAddressIndex');
  //   if (savedIndex !== null) {
  //     setSelectedAddressIndex(parseInt(savedIndex)); // ensure it's a number
  //   }
  // }, []);

   const handleRemove = async (addressId) => {
    // e.preventDefault();
    setShowAlert(false);
    try {
      const response = await axiosInstance.delete(`/api/user/remove-address`, {
  data: { addressId },
  withCredentials: true,
});

      if(response){
        toast.success(response?.data?.message)
        fetchUserDetails ();
      }
    
    } catch (error) {
      setShowAlert(false);
      toast.error(error?.message || 'Something Went Wrong')
     
    }
  };

  useEffect(() => {
    if (selectedAddressIndex !== null) {
      setSelectedAddress(userAddress[selectedAddressIndex]);
      // localStorage.setItem('selectedAddressIndex', selectedAddressIndex);
    }
  }, [selectedAddressIndex, userAddress]);

  return (
    <div className="flex flex-col mt-2 w-full">
      {/* Address Selection */}
      <h2 className="text-xl font-semibold mb-4">
        {userAddress.length > 1 ? `Addresses` : "Address"}
      </h2>
      <div className="max-h-[150px] overflow-y-scroll !text-[9px] px-5 w-full">
        {userAddress.length > 0 ? (
          <div className="flex flex-row flex-wrap gap-2 justify-center">
            {userAddress.map((add, index) => (
              <label
                key={index}
                className={`flex items-start p-2 border rounded-lg hover:shadow transition-all min-w-[180px] text-left flex-1 relative ${
                  selectedAddressIndex === index
                    ? "border-blue-500"
                    : "border-gray-200"
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
                <div className="flex flex-col flex-wrap poppins items-start justify-start">
                  <p className=" mb-1 flex items-center monst font-semibold bg-white p-[2px] rounded-full pr-2 -ml-1 ">
                    <MdHome className="mr-1 linkc size-[16px] bg-white rounded-full p-[2px]" />
                    Address {index + 1}
                  </p>

                  <div className="flex flex-col items-start">
                    {add.name && <p className=" text-gray-700">{add.name}</p>}

                    {add.address && (
                      <p className=" text-gray-700">{add.address}</p>
                    )}

                    {add.city && (
                      <p className=" text-gray-500">
                        {add.city}, {add.state}
                      </p>
                    )}
                    {add.country && (
                      <p className=" text-gray-500">
                        {add.country} - {add.pincode}
                      </p>
                    )}
                  </div>
                </div>

                <div className="flex flex-col absolute top-3 right-3 gap-2 text-[12px]">
                  <button
                    className="bg-black bg-opacity-90 text-white p-[4px] rounded-full "
                    onClick={() => {
                      setOpenEdit(true);
                      setEditData(add);
                    }}
                  >
                    <MdEdit />
                  </button>



                  <button onClick={()=> {
                    setAddressId(add._id)
                    setShowAlert(true)
                    }} className="bg-red-200 bg-opacity-90 text-red-700 p-[4px] rounded-full ">
                    <IoMdTrash />
                  </button>
                </div>
              </label>
            ))}

            {showAlert && (<ConfirmAlert message='Are you sure want to remove address ?' hideAlert={()=>setShowAlert(false)} runFunction={()=> handleRemove(addressId)}/>)}

            {openEdit && (
              <EditAddress
                close={() => setOpenEdit(false)}
                data={editData}
                id={editData._id}
              />
            )}
          </div>
        ) : (
          <p className="monst font-semibold text-gray-400 tracking-wider">
            No address found.
          </p>
        )}
      </div>
    </div>
  );
};
export default Address;
