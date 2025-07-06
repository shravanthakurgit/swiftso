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
      tname: String,
      image: Array,
    },
    payment_id: {
      type: String,
      default: "",
    },
    payment_status: {
      type: String,
      default: "",
    },
    deliver_address: {
      type: mongoose.Schema.ObjectId,
      ref: "address",
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