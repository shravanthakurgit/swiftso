import mongoose from "mongoose";

const cartItemSchema = new mongoose.Schema({
  productId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'product',
    required: true,
  },
  name: String,
  price: Number,
  quantity: {
    type: Number,
    default: 1,
  },
  size: String,
  image: String,
  category: String,
  subCategory: String,
  url: String,
  totalAmount: {
    type: Number,
    default: 0,
  }
}, { _id: false });


const userSchema = new mongoose.Schema({
  first_name: { type: String, required: true },
  last_name: { type: String },
  email: { type: String, required: true, unique: true, lowercase: true, trim: true },
  password: { type: String, required: true },
  avatar: { type: String, default: "" },
 gender: {
  type: String,
  enum: ['male', 'female', 'other',''],
  default: '',
},


  mobile: { type: Number, default: null },
  refresh_token: { type: String, default: "" },
  last_login: { type: Date, default: "" },
  status: { type: String, enum: ['active', 'inactive', 'suspended'], default: "active" },
  verified_email: { type: Boolean, default: false },

  address: [{ type: mongoose.Schema.ObjectId, ref: 'address' }],
  review: [{ type: mongoose.Schema.ObjectId, ref: 'review' }],
  order_history: [{ type: mongoose.Schema.ObjectId, ref: 'order' }],
  likedProduct: [{ type: mongoose.Schema.ObjectId, ref: 'likedProduct' }],
  
  cart: [cartItemSchema],

  forgot_password_otp: { type: String, default: null },
  forgot_password_expiry: { type: Date, default: "" },
  role: { type: String, enum: ["admin", "user", "staff", "manager"], default: "user" }

}, { timestamps: true });

const userModel = mongoose.models.user || mongoose.model("user", userSchema);
export default userModel;
