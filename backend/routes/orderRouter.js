import { Router } from "express";
import auth from "../middleware/auth.js";
import { cashOnDelivery, fetchOrdersForAdmin, generateInvoiceForOrder, getOrders, getSingleOrder, getSingleOrderAdmin, updateStatus, updateStatusAdmin } from "../controllers/orderController.js";

import authAdmin from '../middleware/authAdmin.js';

const orderRouter = Router();

orderRouter.post('/cash-on-delivery',auth, cashOnDelivery)
orderRouter.post('/get-orders',auth, getOrders)
orderRouter.post('/get-order-details',auth, getSingleOrder)

orderRouter.get('/invoice/:orderId',auth, generateInvoiceForOrder)
orderRouter.put('/update-status',auth, updateStatus)

orderRouter.post('/admin-get-orders',authAdmin, fetchOrdersForAdmin)

orderRouter.put('/admin-update-status',authAdmin, updateStatusAdmin)
orderRouter.post('/admin-order-details',authAdmin, getSingleOrderAdmin)

export default orderRouter;