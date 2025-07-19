import { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
// import { token } from "../utils/token";
import { backendUrl } from "../App";
import {toast} from "react-toastify";

const AdminAllCoupons = ({token}) => {
  const [coupons, setCoupons] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchCoupons = async () => {
    try {
      const res = await axios.get(`${backendUrl}/api/coupons/admin-get-all`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setCoupons(res.data.coupons || []);
    } catch (err) {
      console.error("Failed to fetch coupons:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    const confirmed = window.confirm("Are you sure you want to delete this coupon?");
    if (!confirmed) return;

    try {
      const response = await axios.delete(`${backendUrl}/api/coupons/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if(response?.data?.success){
       toast.success(response?.data?.message || "Coupon Deleted");
        setCoupons((prev) => prev.filter((c) => c._id !== id));
     }
     else{
       toast.error(response?.data?.message || "Failed To Delete");
     }

     
     
    } catch (err) {
      console.error("Delete failed:", err);
      alert("Failed to delete coupon.");
    }
  };

  useEffect(() => {
    fetchCoupons();
  }, []);

  if (loading) return <p className="text-center mt-10">Loading coupons...</p>;

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white mt-10 shadow rounded">
      <h2 className="text-2xl font-bold mb-4">All Coupons</h2>
      {coupons.length === 0 ? (
        <p>No coupons found.</p>
      ) : (
        <table className="w-full table-auto border">
          <thead>
            <tr className="bg-gray-100 text-left">
              <th className="p-2 border">Code</th>
              <th className="p-2 border">Type</th>
              <th className="p-2 border">Buy Any</th>
              <th className="p-2 border">Actions</th>
            </tr>
          </thead>
          <tbody>
            {coupons.map((coupon) => (
              <tr key={coupon._id} className="border-b hover:bg-gray-50">
                <td className="p-2 border">{coupon.code}</td>
                <td className="p-2 border capitalize">{coupon.discountType}</td>
                <td className="p-2 border">{coupon.buyAny ? "Yes" : "No"}</td>
                <td className="p-2 border">
                  <Link
                    to={`/admin/edit-coupon/${coupon._id}`}
                    className="text-blue-600 hover:underline mr-4"
                  >
                    Edit
                  </Link>
                  <button
                    onClick={() => handleDelete(coupon._id)}
                    className="text-red-600 hover:underline"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default AdminAllCoupons;
