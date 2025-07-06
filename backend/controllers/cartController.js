import mongoose from "mongoose";
import userModel from "../models/userModel.js";
import productModel from "../models/productModel.js";

// ADD TO CART
export const addToCart = async (req, res) => {
  try {
    const userId = req.userId;
    const {
      productId,
      name,
      price,
      quantity,
      image,
      category,
      subCategory,
      size,
      url
    } = req.body;


    

    const user = await userModel.findById(userId);
    if (!user) return res.status(404).json({ success: false, message: "User not found" });

    const existingItem = user.cart.find(
      item => item.productId.toString() === productId && item.size === size
    );

    if (existingItem) {
      existingItem.quantity += quantity;
      existingItem.totalAmount = existingItem.price * existingItem.quantity;
    } else {
      user.cart.push({
        productId,
        name,
        price,
        quantity,
        image,
        category,
        subCategory,
        size,
        url,
        totalAmount: price * quantity
      });
    }

    await user.save();
    res.status(200).json({ success: true, message: "Item added to cart", cart: user.cart });

  } catch (err) {
    res.status(500).json({ success: false, message: "Server error", error: err.message });
  }
};

// GET CART
export const getCart = async (req, res) => {
  try {
    const userId = req.userId;
    const user = await userModel.findById(userId);
    if (!user) return res.status(404).json({ success: false, message: "User not found" });

    res.status(200).json({ success: true, cart: user.cart });
  } catch (err) {
    res.status(500).json({ success: false, message: "Server error", error: err.message });
  }
};

// UPDATE CART ITEM
export const updateCartItem = async (req, res) => {
  try {
    const userId = req.userId;
    const { productId, size, quantity } = req.body;

    const user = await userModel.findById(userId);
    if (!user) return res.status(404).json({ success: false, message: "User not found" });

    const item = user.cart.find(
      item => item.productId.toString() === productId && item.size === size
    );

    if (!item) return res.status(404).json({ success: false, message: "Item not found in cart" });

    item.quantity = quantity;
    item.totalAmount = item.price * quantity;

    await user.save();
    res.status(200).json({ success: true, message: "Cart item updated", cart: user.cart });

  } catch (err) {
    res.status(500).json({ success: false, message: "Server error", error: err.message });
  }
};

// REMOVE CART ITEM
export const removeCartItem = async (req, res) => {
  try {
    const userId = req.userId;
    const { productId, size } = req.body;

    const user = await userModel.findById(userId);
    if (!user) return res.status(404).json({ success: false, message: "User not found" });

    user.cart = user.cart.filter(
      item => !(item.productId.toString() === productId && item.size === size)
    );

    await user.save();
    res.status(200).json({ success: true, message: "Item removed from cart", cart: user.cart });

  } catch (err) {
    res.status(500).json({ success: false, message: "Server error", error: err.message });
  }
};

// CLEAR ENTIRE CART
export const clearCart = async (req, res) => {
  try {
    const userId = req.userId;

    const user = await userModel.findById(userId);
    if (!user) return res.status(404).json({ success: false, message: "User not found" });

    user.cart = [];

    await user.save();
    res.status(200).json({ success: true, message: "Cart cleared" });

  } catch (err) {
    res.status(500).json({ success: false, message: "Server error", error: err.message });
  }
};
