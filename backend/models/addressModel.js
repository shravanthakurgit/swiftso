import mongoose from "mongoose";

const addressSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  address: {
    type: String,
    required: true,
  },
  address_2: {
    type: String,
    default: '',
  },
  city: {
    type: String,
    required: true,
  },
  state: {
    type: String,
    required: true,
  },
  country: {
    type: String,
    default: 'India',
  },
  pincode: {
    type: String,
    required: true,
  },
  phone: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    default: '',
  },
  landmark: {
    type: String,
    default: '',
  },
  status:{
    type:Boolean,
    default:true,
  }
},{timestamps:true});

const addressModel = mongoose.model('address', addressSchema);

export default addressModel;