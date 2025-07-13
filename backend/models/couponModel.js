import mongoose from "mongoose";

const CouponSchema = new mongoose.Schema({
  code: {
    type: String,
    required: true,
    unique: true,
    uppercase: true,
    trim: true,
  },
  discountType: {
    type: String,
    enum: ['percentage', 'fixed'],
    required: true,
  },
  discountValue: {
    type: Number,
    default: 0,
  },
  minCartValue: {
    type: Number,
    default: 0,
  },
  maxCartQuantity :{
    type:Number,
    default: null,
  },

  buyAny:{
    type: Boolean,
    default: false,
  },
   buyAnyPrice:{
    type: Number,
  },
  expiresAt: {
    type: Date,
    required: true,
  },
  usageLimit: Number, 
  usedCount: {
    type: Number,
    default: 0,
  },
  perUserLimit: {
    type: Number,
    default: 1,
  },
  usersUsed: {
    type: Map,
    of: Number,
    default: {},
  },
},{
  timestamps: true
});

const couponModel  = mongoose.model('Coupon', CouponSchema);

export default couponModel;
