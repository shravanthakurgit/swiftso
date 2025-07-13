import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
// import { token } from "../utils/token";
import { backendUrl } from "../App";
import {toast} from "react-toastify";

const AdminEditCoupon = ({token}) => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { register, handleSubmit, reset } = useForm();
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);

  useEffect(() => {
    const fetchCoupon = async () => {
      try {
        const res = await axios.get(`${backendUrl}/api/coupons/admin-get-all`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        const coupon = res.data.coupons.find((c) => c._id === id);
        if (!coupon) {
          alert("Coupon not found");
          return;
        }

        if (coupon.expiresAt) {
          coupon.expiresAt = new Date(coupon.expiresAt).toISOString().split("T")[0];
        }

        reset(coupon);
      } catch (error) {
      toast.error(error?.response?.data?.message || error?.message || "Something went wrong");

      } finally {
        setFetching(false);
      }
    };

    fetchCoupon();
  }, [id, reset]);

  const onSubmit = async (data) => {
    setLoading(true);
    try {
      await axios.put(`${backendUrl}/api/coupons/admin-update/${id}`, data, {
        headers: { Authorization: `Bearer ${token}` },
      });
      alert("Coupon updated successfully!");
      navigate("/admin/all-coupons");
    } catch (err) {
      console.error(err);
      alert("Failed to update coupon.");
    } finally {
      setLoading(false);
    }
  };

  if (fetching) {
    return <p className="text-center mt-10">Loading coupon details...</p>;
  }

  return (
    <div className="max-w-xl mx-auto mt-10 p-6 bg-white rounded shadow">
      <h2 className="text-2xl font-semibold mb-6">Edit Coupon</h2>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">

        <label className="block">
          <span className="font-medium">Coupon Code</span>
          <input {...register("code")} className="input w-full mt-1" readOnly />
        </label>

        <label className="block">
          <span className="font-medium">Discount Type</span>
          <select {...register("discountType")} className="input w-full mt-1">
            <option value="percentage">Percentage</option>
            <option value="fixed">Fixed</option>
          </select>
        </label>

        <label className="block">
          <span className="font-medium">Discount Value</span>
          <input type="number" {...register("discountValue")} className="input w-full mt-1" />
        </label>

        <label className="block">
          <span className="font-medium">Minimum Cart Value</span>
          <input type="number" {...register("minCartValue")} className="input w-full mt-1" />
        </label>

        <label className="block">
          <span className="font-medium">Maximum Cart Quantity</span>
          <input type="number" {...register("maxCartQuantity")} className="input w-full mt-1" />
        </label>

        <label className="flex items-center space-x-2">
          <input type="checkbox" {...register("buyAny")} />
          <span>Buy Any</span>
        </label>

        <label className="block">
          <span className="font-medium">Buy Any Price</span>
          <input type="number" {...register("buyAnyPrice")} className="input w-full mt-1" />
        </label>

        <label className="block">
          <span className="font-medium">Expiry Date</span>
          <input type="date" {...register("expiresAt")} className="input w-full mt-1" />
        </label>

        <label className="block">
          <span className="font-medium">Usage Limit</span>
          <input type="number" {...register("usageLimit")} className="input w-full mt-1" />
        </label>

        <label className="block">
          <span className="font-medium">Per User Limit</span>
          <input type="number" {...register("perUserLimit")} className="input w-full mt-1" />
        </label>

        <button
          type="submit"
          className="btn-primary w-full mt-4 bg-yellow-400 p-2 rounded "
          disabled={loading}
        >
          {loading ? "Updating..." : "Update Coupon"}
        </button>
      </form>
    </div>
  );
};

export default AdminEditCoupon;
