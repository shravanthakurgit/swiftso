import { useState } from "react";
import { useForm } from "react-hook-form";
import axiosInstance from "../../api/axiosInstance";
import { useUserData } from "../../context/UserContext";
import { refreshAccessToken } from "../../auth/authService";
import { MdEdit } from "react-icons/md";
import { IoIosClose } from "react-icons/io";
import { toast } from "react-toastify";
import Loading from "../../utils/Loading";

export default function EditAddress({data,close}) {
    const {fetchUserDetails} = useUserData();
  const [open, setOpen] = useState(true);
  const [loading, setLoading] = useState(false)

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    defaultValues : {
        _id: data._id,
        name: data.name,
        address: data.address,
        address_2: data.address_2,
        city: data.city,
        state: data.state,
        country: data.country,
        pincode: data.pincode,
        phone: data.phone,
        email: data.email,
        landmark: data.landmark,
        status: true,
      },
  });

  const onSubmit = async (data,e) => {
    e.preventDefault()
  try {
setLoading(true);
    await refreshAccessToken();

    const response = await axiosInstance.put(
      '/api/user/edit-address', 
      {
        _id:data._id,
        name: data.name,
        address: data.address,
        address_2: data.address_2,
        city: data.city,
        state: data.state,
        country: data.country,
        pincode: data.pincode,
        phone: data.phone,
        email: data.email,
        landmark: data.landmark,
        status: true,
      },
     {
        withCredentials: true,
        headers: {
          'Content-Type': 'application/json',
        },
      }
    );

    if(response){
    fetchUserDetails();
    }

   
  
   close();
  } catch (error) {
   toast.error(error);
  }
  setLoading(false);
};

  return (
    <>


      {open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 px-4 text-sm">

          {loading &&(
        <Loading message='Updating Address...'/>
      )}
          <div className="bg-white rounded-xl max-w-2xl w-full p-6 overflow-y-auto max-h-[90vh] shadow-lg">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold flex items-center gap-2">Edit Address <MdEdit/> </h2>
              <button
                onClick={close}
                className="text-gray-600 hover:text-gray-700 text-2xl  bg-gray-200 rounded-full h-8 w-8 flex -mt-2 justify-center items-center flex-col text-center"
              ><IoIosClose/>
              </button>
            </div>

            <form onSubmit={handleSubmit(onSubmit)} className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <input
                  placeholder="Full Name"
                  {...register("name", { required: true })}
                  className="w-full border px-3 py-2 rounded"
                />
                {errors.name && <p className="text-red-500 text-sm">Name is required</p>}
              </div>

              <div>
                <input
                  placeholder="Phone"
                  {...register("phone", { required: true })}
                  className="w-full border px-3 py-2 rounded"
                />
                {errors.phone && <p className="text-red-500 text-sm">Phone is required</p>}
              </div>

              <div className="md:col-span-2">
                <input
                  placeholder="Address Line 1"
                  {...register("address", { required: true })}
                  className="w-full border px-3 py-2 rounded"
                />
                {errors.address && <p className="text-red-500 text-sm">Address is required</p>}
              </div>

              <div className="md:col-span-2">
                <input
                  placeholder="Address Line 2 (Optional)"
                  {...register("address_2")}
                  className="w-full border px-3 py-2 rounded"
                />
              </div>

              <div>
                <input
                  placeholder="City"
                  {...register("city", { required: true })}
                  className="w-full border px-3 py-2 rounded"
                />
                {errors.city && <p className="text-red-500 text-sm">City is required</p>}
              </div>

              <div>
                <input
                  placeholder="State"
                  {...register("state", { required: true })}
                  className="w-full border px-3 py-2 rounded"
                />
                {errors.state && <p className="text-red-500 text-sm">State is required</p>}
              </div>

              <div>
                <input
                  placeholder="Country"
                  defaultValue="India"
                  {...register("country")}
                  className="w-full border px-3 py-2 rounded"
                />
              </div>

              <div>
                <input
                  placeholder="Pincode"
                  {...register("pincode", { required: true })}
                  className="w-full border px-3 py-2 rounded"
                />
                {errors.pincode && <p className="text-red-500 text-sm">Pincode is required</p>}
              </div>

              <div className="md:col-span-2">
                <input
                  placeholder="Landmark (Optional)"
                  {...register("landmark")}
                  className="w-full border px-3 py-2 rounded"
                />
              </div>

              <div className="md:col-span-2">
                <input
                  placeholder="Email (Optional)"
                  type="email"
                  {...register("email")}
                  className="w-full border px-3 py-2 rounded"
                />
              </div>

              <div className="md:col-span-2 flex justify-end">
                <button
                  type="submit"
                  className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 w-full"
                >
                  Update Address
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
