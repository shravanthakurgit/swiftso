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
import rateLimit from 'express-rate-limit';
dotenv.config();
import axios from 'axios';


const app = express();
const port = process.env.PORT || 5000;

app.set('trust proxy', 1);

connectDB();
connectCloudinary();

app.use('/invoices', express.static(path.join(process.cwd(), 'invoices')));

// Middleware
const allowedOrigins = [
  process.env.FRONTEND_URL,
  process.env.ADMIN_FRONTEND_URL,
];

app.use(cors({
  origin: function (origin, callback) {
    if (!origin || allowedOrigins.includes(origin)) {
      return callback(null, true);
    }
    console.warn(`CORS blocked origin: ${origin}`);
    return callback(new Error('Not allowed by CORS'));
  },
  credentials: true,
  optionsSuccessStatus: 200, 
}));



app.use(express.json());

//cookies parser
app.use(cookieParser());

// Use body-parser

// app.use(bodyParser.json()); // Parse application/json
// app.use(bodyParser.urlencoded({ extended: true })); // Parse application/x-www-form-urlencoded

const limiter = rateLimit({
  windowMs: 1 * 60 * 1000,  
  max: 150,                 
  message: 'Too many requests from this IP, please try again later.',
  standardHeaders: true,   
  legacyHeaders: false,     
});

app.use('/api/', limiter);

// Routes
app.use('/api/user', userRouter);
app.use('/api/coupons', couponRouter);
app.use('/api/product', productRouter);
app.use('/api/cart', cartRouter);
app.use('/api/order', orderRouter);

// Root
app.get('/', (req, res) => {
  res.send("API is working!" + process.env.FRONTEND_URL);
});

// bypassing render server delay for 1 minute
const url = `https://swiftso-backend.onrender.com`
const interval = 40000;

function reloadWebsite() {
  axios
    .get(url)
    .then((response) => {
      return
    })
    .catch((error) => {
      return
    });
}

setInterval(reloadWebsite, interval);

app.listen(port, async () => {
  console.log(`Express server is listening on port ${port}`);
});
