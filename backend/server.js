import express from 'express';
import cors from 'cors';
import connectDB from './config/mongodb.js';
import connectCloudinary from './config/cloudinary.js';
import userRouter from './routes/userRouter.js';
import productRouter from './routes/productRouter.js';
import couponRouter from './routes/couponRoutes.js';
import dotenv from 'dotenv';
import cookieParser from 'cookie-parser';
import cartRouter from './routes/cartRouter.js';
import orderRouter from './routes/orderRouter.js';
import path from 'path';


dotenv.config();






const app = express();
const port = process.env.PORT || 5000;

// Database & Cloudinary
connectDB();
connectCloudinary();

// Middleware
const allowedOrigins = [
  process.env.FRONTEND_URL ,
  process.env.ADMIN_FRONTEND_URL,
  process.env.PUBLIC_PORT,

 
];

app.use('/invoices', express.static(path.join(process.cwd(), 'invoices')));

app.use(cors({
  origin: function (origin, callback) {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      console.error('Blocked by CORS:', origin);
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
}));

app.use(express.json());

//cookies parser
app.use(cookieParser());

// Use body-parser

// app.use(bodyParser.json()); // Parse application/json
// app.use(bodyParser.urlencoded({ extended: true })); // Parse application/x-www-form-urlencoded

// Routes
app.use('/api/user', userRouter);
app.use('/api/coupons', couponRouter);
app.use('/api/product', productRouter);
app.use('/api/cart', cartRouter);
app.use('/api/order', orderRouter);

// Root
app.get('/', (req, res) => {
  res.send("API is working!");
});

app.listen(port, () => {
  console.log(`Server started successfully on port ${port}`);
});
