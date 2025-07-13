import couponModel from "../models/couponModel.js";

export const getAllCoupons = async (req, res) => {
  try {
    const coupons = await  couponModel.find({}).sort({ createdAt: -1 });
    res.status(200).json({ success: true, coupons });
  } catch (error) {
    res.status(500).json({ success: false, message: "Failed to fetch coupons", error: error.message });
  }
};


export const updateCoupon = async (req, res) => {
  try {
    const { id } = req.params;
    const updateFields = req.body;

    const updatedCoupon = await  couponModel.findByIdAndUpdate(id, updateFields, {
      new: true,
      runValidators: true,
    });

    if (!updatedCoupon) {
      return res.status(404).json({ success: false, message: "Coupon not found" });
    }

    res.status(200).json({ success: true, updatedCoupon });
  } catch (error) {
    res.status(500).json({ success: false, message: "Failed to update coupon", error: error.message });
  }
};