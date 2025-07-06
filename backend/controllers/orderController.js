import mongoose from "mongoose";
import userModel from "../models/userModel.js";
import userOrderModel from "../models/userOrderModel.js";

import { generateInvoice } from "../utils/generateInvoice.js";
import addressModel from "../models/addressModel.js";
import path from "path";
import couponModel from "../models/couponModel.js";
import { platform } from "os";

export const cashOnDelivery = async (req, res) => {
  try {
    const userId = req.userId;
    const { itemList, address_id, couponCode } = req.body;

    if (!userId) return res.status(401).json({ success: false, message: "Unauthorized" });
    if (!itemList || itemList.length === 0) return res.status(400).json({ success: false, message: "No items in cart" });
    if (!address_id) return res.status(400).json({ success: false, message: "Address is required" });

    // 1. Calculate subtotal
 const subTotal = itemList.reduce((acc, item) => acc + item.price * item.quantity, 0);
const totalQuantity = itemList.reduce((acc, item) => acc + item.quantity, 0);


let PLATFORM_FEE = 10;     
let DELIVERY_FEE = 30;     

let discountAmount = 0;
let discountType = null;
let overrideTotal = null;


if (couponCode) {
  const coupon = await couponModel.findOne({ code: couponCode });

  if (!coupon) {
    return res.status(400).json({ success: false, message: 'Invalid coupon' });
  }

  if (coupon.expiresAt && new Date(coupon.expiresAt) < new Date()) {
    return res.status(400).json({ success: false, message: 'Coupon expired' });
  }

  if (coupon.minCartValue && subTotal < coupon.minCartValue) {
    return res.status(400).json({ success: false, message: `Minimum cart value should be ₹${coupon.minCartValue}` });
  }

  if (coupon.maxCartQuantity && totalQuantity > coupon.maxCartQuantity) {
    return res.status(400).json({ success: false, message: `Maximum cart quantity allowed is ${coupon.maxCartQuantity}` });
  }

  if (coupon.buyAny === true && totalQuantity <= coupon.maxCartQuantity) {
   
       PLATFORM_FEE = 0;
    DELIVERY_FEE = 0;
    overrideTotal = Math.round(coupon.buyAnyPrice + PLATFORM_FEE + DELIVERY_FEE);
    discountAmount = Math.max((subTotal + PLATFORM_FEE + DELIVERY_FEE) - overrideTotal, 0);
    discountType = "buyAny";
  } else {
    
    discountType = coupon.discountType;
    if (coupon.discountType === "percentage") {
      discountAmount = (coupon.discountValue / 100) * subTotal;
    } else {
      discountAmount = coupon.discountValue;
    }
  }
}

   const totalAmount = overrideTotal !== null
  ? overrideTotal
  : Math.round(subTotal + PLATFORM_FEE + DELIVERY_FEE - discountAmount);


   
    const user = await userModel.findById(userId);
    const address = await addressModel.findById(address_id);

    if (!address) {
      return res.status(404).json({ success: false, message: "Address not found." });
    }

    const billing_address = {
      name: address.name,
      address: address.address,
      address_2: address?.address_2 || '',
      city: address.city,
      state: address?.state || '',
      country: address.country,
      pincode: address.pincode,
      phone: address.phone,
      email: address?.email || '',
      landmark: address?.landmark || ''
    };

  
 const invoiceData = {
  paymentId: `COD${Date.now()}`,
  payment_method: 'COD',
  date: new Date().toLocaleDateString(),
  invoice_date: new Date().toLocaleDateString(),
  customerName: `${user.first_name} ${user?.last_name || ''}`,
  billing_address,
  items: itemList.map(item => ({
    name: item.name,
    quantity: item.quantity,
    price: item.price * item.quantity,
  })),
  subTotal,
  platformFee: PLATFORM_FEE,
  deliveryFee: DELIVERY_FEE,
  discountAmount: Math.round(discountAmount),
  total: totalAmount,
};


    const invoicePath = await generateInvoice(invoiceData);
    const fileName = path.basename(invoicePath);
    const invoiceUrl = `${req.protocol}://${req.get('host')}/invoices/${fileName}`;

   
    const orders = itemList.map(item => ({

        

      userId,
      orderId: `ORD${new mongoose.Types.ObjectId().toString().toUpperCase()}`,
      productId: item.productId,
      product_details: {
        name: item.name,
        quantity: item.quantity,
        size: item.size,
        image: item.image,
        price: item.price * item.quantity,
        platform_Fee: PLATFORM_FEE,
        delivery_Fee: DELIVERY_FEE,
        totalAmount: item.price*item.quantity + PLATFORM_FEE + DELIVERY_FEE,
      },
      payment_id: invoiceData.paymentId,
      payment_Method: 'COD',
      deliver_address: address_id,
      subTotalAmt: subTotal,
      totalAmt: totalAmount,
      platform_fee: PLATFORM_FEE,
      delivery_fee: DELIVERY_FEE,
      discountAmount: Math.round(discountAmount),
      discountType,
      invoice_receipt: invoiceUrl,
    }));

    const order = await userOrderModel.insertMany(orders);
    await userModel.findOneAndUpdate({_id:userId},{cart: []})

    return res.status(201).json({
      success: true,
      message: "Order placed successfully",
      orderDetails: orders,
      invoice: invoiceUrl,
      totalAmount,
      discountApplied: !!couponCode,
      discountAmount: Math.round(discountAmount),
    });

  } catch (error) {
    console.error("COD error:", error);
    return res.status(500).json({ success: false, message: error.message });
  }
};


export const getOrders = async (req,res)=>{
    try {
        const userId = req.userId
        if(!userId){
            return res.status(401).json({
                success:false,
                message: "Unauthorized",
            })
        }

        const orderList = await userOrderModel.find({userId: userId}).sort({createdAt:-1})
        return res.status(201).json({
            success:true,
            orderList: orderList
        })
    } catch (error) {
        return res.status(501).json({
            success:false,
            message: error,
        })
    }
}



export const getSingleOrder = async (req,res)=>{
    try {
        const userId = req.userId
        const {orderId}= req.body
        if(!userId){
            return res.status(401).json({
                success:false,
                message: "Unauthorized",
            })
        }

        const order = await userOrderModel.find({orderId: orderId})
        return res.status(201).json({
            success:true,
            order: order
        })
    } catch (error) {
        return res.status(501).json({
            success:false,
            message: error,
        })
    }
}

export const updateStatus = async (req,res)=>{
    try {
        const userId = req.userId
        const {orderId,status}= req.body
        if(!userId){
            return res.status(401).json({
                success:false,
                message: "Unauthorized",
            })
        }
          if(!orderId){
            return res.status(401).json({
                success:false,
                message: "Missing OrderId",
            })
        }
         if(!status){
            return res.status(401).json({
                success:false,
                message: "Missing Status",
            })
        }

        const order = await userOrderModel.findOneAndUpdate({orderId: orderId},{
            order_status: status
        })
        return res.status(201).json({
            success:true,
            status: order.order_status
        })
    } catch (error) {
        return res.status(501).json({
            success:false,
            message: error,
        })
    }
}

