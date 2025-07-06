import express from 'express'
import auth from '../middleware/auth.js';
import authAdmin from '../middleware/authAdmin.js';
import { addToCart, getCart, removeCartItem, updateCartItem } from '../controllers/cartController.js';

const cartRouter = express.Router();

cartRouter.post("/add", auth, addToCart);
cartRouter.get("/get-cart", auth, getCart);
cartRouter.put("/update-quantity", auth, updateCartItem);
cartRouter.delete("/remove", auth, removeCartItem);


export default cartRouter