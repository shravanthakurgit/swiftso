import mongoose from "mongoose";

const userOrderSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.ObjectId,
      ref: "user",
    },
    orderId: {
      type: String,
      required: [true, "Provide orderId"],
      unique: true,
    },
    productId: {
      type: mongoose.Schema.ObjectId,
      ref: "product",
    },
   product_details: {
  name: { type: String },
  quantity: { type: Number },
  size: { type: String },
  image: { type: String },
  price: { type: Number },
  platform_Fee:{type: Number},
  delivery_Fee:{type: Number},
  discount:{type:Number},
  totalAmount:{type: Number},
   },
    payment_id: {
      type: String,
      default: "",
    },
    payment_Method: {
      type: String,
      default: "",
    },
    deliver_address: {
  name: String,
  address: String,
  address_2: String,
  city: String,
  state: String,
  country: String,
  pincode: String,
  phone: String,
  email: String,
  landmark: String
},

    order_status: {
      type: String,
      enum : ['delivered','cancelled','pending','placed','returned','refunded'],
      default:'pending'
    },
    subTotalAmt: {
      type: Number,
      default: 0,
    },
    totalAmt: {
      type: Number,
      default: 0,
    },
    invoice_receipt: {
      type: String,
      default: "",
    },
  },
  { timestamps: true }
);


const userOrderModel = mongoose.model("userOrder",  userOrderSchema);
export default userOrderModel;