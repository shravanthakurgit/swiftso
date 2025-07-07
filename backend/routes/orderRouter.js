import { Router } from "express";
import auth from "../middleware/auth.js";
import { cashOnDelivery, getOrders, getSingleOrder, updateStatus } from "../controllers/orderController.js";

const orderRouter = Router();

orderRouter.post('/cash-on-delivery',auth, cashOnDelivery)
orderRouter.post('/get-orders',auth, getOrders)
orderRouter.post('/get-order-details',auth, getSingleOrder)
orderRouter.put('/update-status',auth, updateStatus)

export default orderRouter;