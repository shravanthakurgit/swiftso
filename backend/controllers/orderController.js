import mongoose from "mongoose";
import userModel from "../models/userModel.js";
import userOrderModel from "../models/userOrderModel.js";
import { generateInvoice } from "../utils/generateInvoice.js";
import addressModel from "../models/addressModel.js";
import path from "path";
import couponModel from "../models/couponModel.js";
import { platform } from "os";
import { customAlphabet } from 'nanoid';
import dotenv from 'dotenv';
dotenv.config();

export const cashOnDelivery = async (req, res) => {
  try {
    const userId = req.userId;

   if (!userId) return res.status(401).json({ success: false, message: "Unauthorized" });

      const user = await userModel.findById(userId)
  

if (!user) {
  return res.status(404).json({ success: false, message: "Missing User" });
}


    if (!user.verified_email) {
  return res.status(401).json({
    success: false,
    message: "Email not verified ! Go to Profile & Verify First",
  });
}

    const { itemList, address_id, couponCode } = req.body;

    
    if (!itemList || itemList.length === 0) return res.status(400).json({ success: false, message: "No items in cart" });
    if (!address_id) return res.status(400).json({ success: false, message: "Address is required" });

    const subTotal = itemList.reduce((acc, item) => acc + item.price * item.quantity, 0);
    const totalQuantity = itemList.reduce((acc, item) => acc + item.quantity, 0);

    // Delivery Fee
    let DELIVERY_FEE = 0;
    const DELIVERY_FEE_THRESHOLD = Number(process.env.APP_DELIVERY_FEE_THRESHOLD);
    if (subTotal < DELIVERY_FEE_THRESHOLD) {
      DELIVERY_FEE = Number(process.env.APP_DELIVERY_FEE);
    }

    // Coupon logic
    let discountAmount = 0;
    let discountType = null;
    let overrideTotal = null;
    let coupon = null;

    if (couponCode) {
      coupon = await couponModel.findOne({ code: couponCode });

      if (!coupon) return res.status(400).json({ success: false, message: 'Invalid coupon' });
      if (coupon.expiresAt && new Date(coupon.expiresAt) < new Date())
        return res.status(400).json({ success: false, message: 'Coupon expired' });

      if (coupon.minCartValue && subTotal < coupon.minCartValue)
        return res.status(400).json({ success: false, message: `Minimum cart value should be ₹${coupon.minCartValue}` });

      if (coupon.maxCartQuantity && totalQuantity > coupon.maxCartQuantity)
        return res.status(400).json({ success: false, message: `Maximum cart quantity allowed is ${coupon.maxCartQuantity}` });

      if (coupon.buyAny === true && totalQuantity <= coupon.maxCartQuantity) {
        DELIVERY_FEE = 0;
        overrideTotal = Math.round(coupon.buyAnyPrice + DELIVERY_FEE);
        discountAmount = Math.max((subTotal + DELIVERY_FEE) - overrideTotal, 0);
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

    // Distribute discount per item
    const updatedItemList = itemList.map(item => {
      const itemTotal = item.price * item.quantity;
      const itemShare = itemTotal / subTotal;
      const itemDiscount = overrideTotal !== null ? 0 : itemShare * discountAmount;
      return {
        ...item,
        totalPriceBeforeDiscount: itemTotal,
        itemDiscount: itemDiscount,
        totalPriceAfterDiscount: itemTotal - itemDiscount,
      };
    });

   
    let perItemDeliveryFees = Array(updatedItemList.length).fill(0);
    if (subTotal < DELIVERY_FEE_THRESHOLD) {
      perItemDeliveryFees[0] = DELIVERY_FEE;
    }

    const totalAmount = overrideTotal !== null
      ? overrideTotal
      : Math.round(
          updatedItemList.reduce((acc, item, index) =>
            acc +
            item.totalPriceAfterDiscount +
            perItemDeliveryFees[index], 0)
        );

  




    const address = await addressModel.findById(address_id);
    if (!address) return res.status(401).json({ success: false, message: "Address not found." });

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
      items: updatedItemList.map((item, index) => ({
        name: item.name,
        size: item.size,
        quantity: item.quantity,
        price: Math.round(item.totalPriceAfterDiscount),
        originalPrice: item.totalPriceBeforeDiscount,
        discount: Math.round(item.itemDiscount),
        deliveryFee: perItemDeliveryFees[index]
      })),
      subTotal,
      deliveryFee: perItemDeliveryFees.reduce((sum, fee) => sum + fee, 0),
      discountAmount: Math.round(discountAmount),
      total: totalAmount,
    };

    const invoicePath = await generateInvoice(invoiceData);
    const fileName = path.basename(invoicePath);
    const invoiceUrl = `${req.protocol}://${req.get('host')}/invoices/${fileName}`;

const generateDigit = customAlphabet('0123456789', 1); // First char: digit
const generateRest = customAlphabet('ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789', 10); 


    const orders = updatedItemList.map((item, index) => {
      const deliveryFee = perItemDeliveryFees[index];
      const productBaseTotal = item.totalPriceAfterDiscount;
      const productTotal = Math.round(productBaseTotal + deliveryFee);
      

      return {
        userId,
        orderId: `ORD${generateDigit()}${generateRest()}`,
        productId: item.productId,
        product_details: {
          name: item.name,
          quantity: item.quantity,
          image: item.image,
          size: item.size,
          price: item.totalPriceBeforeDiscount,
          delivery_Fee: deliveryFee,
          discount: Math.round(item.itemDiscount),
          totalAmount: productTotal,
        },
        payment_id: invoiceData.paymentId,
        payment_Method: 'COD',
        deliver_address: address_id,
        subTotalAmt: subTotal,
        totalAmt: totalAmount,
        delivery_fee: deliveryFee,
        discountAmount: Math.round(discountAmount),
        discountType,
        invoice_receipt: invoiceUrl,
      };
    });

    await userOrderModel.insertMany(orders);
    await userModel.findOneAndUpdate({ _id: userId }, { cart: [] });

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



export const fetchOrdersForAdmin = async (req,res)=>{

    try {

        const orderList = await userOrderModel.find({}).populate("deliver_address").sort({createdAt:-1})
        return res.status(201).json({
            success:true,
            orderList: orderList
        })
    }
     catch (error) {
        return res.status(501).json({
            success:false,
            message: error,
        })
    }
}



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

        const order = await userOrderModel.find({orderId: orderId}).populate("deliver_address")
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




export const updateStatusAdmin = async (req,res)=>{
    try {
        const {orderId,status}= req.body
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



export const getSingleOrderAdmin = async (req,res)=>{
    try {
       
        const {orderId}= req.body

        const order = await userOrderModel.find({orderId: orderId}).populate("deliver_address")
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


