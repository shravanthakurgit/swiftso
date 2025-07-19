import express from 'express';
import authAdmin from '../middleware/authAdmin.js';
import couponModel from '../models/couponModel.js';
import { getAllCoupons, updateCoupon } from '../controllers/couponController.js';
import dotenv from 'dotenv';
dotenv.config();

const couponRouter = express.Router();

// Admin creates a coupon
couponRouter.post('/', authAdmin, async (req, res) => {
  try {
         const user = req.user
       const role = user.role
       console.log(user)
  if(role !== 'admin'){
    return res.json({
      success:false,
      message:'Only Admin Can Add Coupon'
    })
  }
    const coupon = new couponModel(req.body);
    await coupon.save();
    res.status(201).json({ success: true, message: 'Coupon added successfully! ' });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Users apply a coupon
couponRouter.post('/apply', async (req, res) => {
  try {
    const { code, items, userId } = req.body;

    if (!code || !Array.isArray(items) || items.length === 0) {
      return res.status(400).json({ message: 'Coupon code and cart items are required. ' });
    }

    let cartTotal = 0;
    let totalQuantity = 0;

    items.forEach(item => {
      cartTotal += item.price;
      totalQuantity += item.quantity;
    });

    const coupon = await couponModel.findOne({ code });

    if (!coupon) {
      return res.status(404).json({ valid: false, message: 'Invalid coupon!' });
    }

    if (coupon.expiresAt && new Date(coupon.expiresAt) < new Date()) {
      return res.status(400).json({ valid: false, message: 'Coupon expired!' });
    }

    if (coupon.minCartValue  && cartTotal < coupon.minCartValue) {
      return res.status(400).json({
        valid: false,
        message: `Minimum cart value should be ₹${coupon.minCartValue}`,
      });
    }

    if (coupon.maxCartQuantity && totalQuantity > coupon.maxCartQuantity) {
      return res.status(400).json({
        valid: false,
        message: `Maximum cart quantity allowed is ${coupon.maxCartQuantity}`,
      });
    }

    
    if (coupon.buyAny === true && totalQuantity <= coupon.maxCartQuantity) {
      return res.json({
        valid: true,
        buyAny: true,
        buyAnyPrice: Math.round(coupon.buyAnyPrice),
        finalPrice: Math.round(coupon.buyAnyPrice),
        message: 'Special deal applied!',
      });
    }

 
    let discountAmount = 0;
    if (coupon.discountType === 'percentage') {
      discountAmount = (coupon.discountValue / 100) * cartTotal;
    } else {
      discountAmount = coupon.discountValue;
    }

  
    const PLATFORM_FEE = 4;
    const DELIVERY_FEE = cartTotal < 500 ? 30 : 0;

    // After calculating all:
const originalTotalBeforeDiscount = cartTotal + PLATFORM_FEE + DELIVERY_FEE;

const finalPrice = originalTotalBeforeDiscount - discountAmount;

return res.json({
  valid: true,
  discountType: coupon.discountType,
  discountValue: coupon.discountValue,
  discountAmount: Math.round(discountAmount),
  platformFee: PLATFORM_FEE,
  deliveryFee: DELIVERY_FEE,
  cartTotal: Math.round(cartTotal),
  originalTotalBeforeDiscount: Math.round(originalTotalBeforeDiscount),
  finalPrice: Math.round(finalPrice),
  message: 'Coupon applied successfully!',
});


  } catch (err) {
    console.error('Error applying coupon:', err);
    res.status(500).json({ message: 'Internal server error.' });
  }
});


couponRouter.delete('/:id', authAdmin, async (req, res) => {
  try {
         const user = req.user
       const role = user.role
  if(role !== 'admin'){
    return res.json({
      success:false,
      message:'Only Admin Can Remove Coupon'
    })
  }
    await couponModel.findByIdAndDelete(req.params.id);
    res.json({ success: true, message: 'Coupon deleted successfully.' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: 'Failed to delete coupon.' });
  }
});



couponRouter.get('/admin-get-all',authAdmin, getAllCoupons);
couponRouter.put('/admin-update/:id',authAdmin, updateCoupon);

export default couponRouter;
