import express from 'express';
import auth from '../middleware/auth.js';
import { 
  addProduct, 
  addReview, 
  getUserLikedProducts, 
  listProducts, 
  removeProduct, 
  removeReview, 
  searchProduct, 
  singleProduct, 
  syncLikes, 
  toggleLike, 
  updateProduct
} from '../controllers/productController.js';
import upload from '../middleware/multer.js';
import authAdmin from '../middleware/authAdmin.js';

const productRouter = express.Router();

// Add a new product with image uploads

productRouter.post(
  '/add',
  authAdmin,
  upload.fields([
    { name: 'image1', maxCount: 1 },
    { name: 'image2', maxCount: 1 },
    { name: 'image3', maxCount: 1 },
    { name: 'image4', maxCount: 1 },
    { name: 'image5', maxCount: 1 },
    { name: 'image6', maxCount: 1 },
  ]),
  addProduct
);



// Remove a product (expects product ID in body)
productRouter.post('/remove',authAdmin, removeProduct);
productRouter.post('/add-review',auth, addReview);
productRouter.post('/remove-review',auth, removeReview);

// Get list of all products
productRouter.post('/list', listProducts);

// Get a single product (by ID or slug)
productRouter.post('/single', singleProduct);
productRouter.post('/search', searchProduct);
productRouter.post('/toggle-like',auth, toggleLike);
productRouter.post('/sync-liked',auth, syncLikes);
productRouter.post('/user-liked',auth, getUserLikedProducts);

productRouter.put('/update', upload.fields([
  { name: 'image1', maxCount: 1 },
  { name: 'image2', maxCount: 1 },
  { name: 'image3', maxCount: 1 },
  { name: 'image4', maxCount: 1 },
  { name: 'image5', maxCount: 1 },
  { name: 'image6', maxCount: 1 }
]), updateProduct);


export default productRouter;
