import mongoose from "mongoose";
import upload from '../middleware/multer.js';
import productModel from '../models/productModel.js';
import cloudinary from 'cloudinary';
import { promises as fsPromises } from 'fs';
import userModel from "../models/userModel.js";
import reviewModel from "../models/reviewModel.js";
import likedProductModel from "../models/likedProductModel.js";

const addProduct = async (req, res) => {
  try {
    const {
      name,
      brand,
      description,
      price,
      mrpPrice,
      discount,
      category,
      subCategory,
      featured,
      bestseller,
      variants // JSON string
    } = req.body;

    const images = [
      req.files?.image1?.[0],
      req.files?.image2?.[0],
      req.files?.image3?.[0],
      req.files?.image4?.[0],
      req.files?.image5?.[0],
      req.files?.image6?.[0]
    ].filter(Boolean);

    const imageUrls = await Promise.all(
      images.map(file => 
        cloudinary.uploader.upload(file.path, { resource_type: 'image' })
          .then(result => result.secure_url)
      )
    );

    // Delete uploaded local files after uploading to Cloudinary
    await Promise.all(images.map(file => fsPromises.unlink(file.path)));

    // Parse and validate variants
    let parsedVariants;
    try {
      parsedVariants = JSON.parse(variants);
      if (!Array.isArray(parsedVariants)) throw new Error('Invalid variants format');

      // Convert numeric fields and validate each variant
      for (const variant of parsedVariants) {
        variant.stock = Number(variant.stock);
        variant.price = variant.price ? Number(variant.price) : 0;

        if (
          typeof variant.size !== 'string' ||
          Number.isNaN(variant.stock) || variant.stock < 0
        ) {
          throw new Error('Invalid variant entry');
        }
      }
    } catch (err) {
      return res.status(400).json({ success: false, message: 'Invalid variants data' });
    }

    // Prepare product data
    const productData = {
      name,
      brand,
      description,
      price: Number(price),
      mrpPrice: Number(mrpPrice),
      discount: Number(discount),
      images: imageUrls,
      variants: parsedVariants,
      category,
      subCategory,
      featured: featured === 'true',
      bestseller: bestseller === 'true',
      date: Date.now()
    };

    // Save product
    const product = new productModel(productData);
    await product.save();

    res.status(201).json({ success: true, message: 'Product added successfully!' });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ success: false, message: error.message });
  }
};



const removeProduct = async(req,res)=>{

    try {
        await productModel.findByIdAndDelete(req.body.id);
        res.json({success:true,message:"product removed"})
    }
    catch (error) {
        res.json({success:false, message:error.message})
        }

}

const listProducts = async(req,res)=>{

    try {

        const products = await productModel.find({})
  .populate({
    path: 'reviews',
    populate: {
      path: 'userId',
      select: 'first_name last_name'
    }
  });
;
        
        res.json({success:true,products})
    }
    catch (error) {
        res.json({success:false, message:error.message})
        }

}                                                                                          
const singleProduct = async (req, res) => {
  try {
    const { productId } = req.query; // ✅ Get from query for GET request
    const product = await productModel.findById(productId).populate({
    path: 'reviews',
    populate: {
      path: 'userId',
      select: 'first_name last_name'
    }
  });;


    

    if (!product) {
      return res.status(404).json({ success: false, message: "Product not found" });
    }

    

    res.json({ success: true, product });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};



const updateProduct = async (req, res) => {
  try {
    const {
      id,
      name,
      brand,
      description,
      price,
      mrpPrice,
      discount,
      category,
      subCategory,
      featured,
      bestseller,
      variants // JSON string
    } = req.body;

    const product = await productModel.findById(id);
    if (!product) {
      return res.status(404).json({ success: false, message: 'Product not found' });
    }

    // Handle image updates
    const updatedImages = [...product.images]; // Clone existing images

    const imageFields = ['image1', 'image2', 'image3', 'image4', 'image5', 'image6'];

    for (let i = 0; i < imageFields.length; i++) {
      const field = imageFields[i];
      const file = req.files?.[field]?.[0];

      if (file) {
        const result = await cloudinary.uploader.upload(file.path, { resource_type: 'image' });
        updatedImages[i] = result.secure_url;
        await fsPromises.unlink(file.path); // Clean up temp file
      }
    }

    // Parse and validate variants
    let parsedVariants = product.variants;
    if (variants) {
      try {
    if (typeof variants === 'string') {
      parsedVariants = JSON.parse(variants);
    } else if (Array.isArray(variants)) {
      parsedVariants = variants;
    } else {
      throw new Error('Invalid variants format');
    }

        for (const variant of parsedVariants) {
          variant.stock = Number(variant.stock);
          variant.price = variant.price ? Number(variant.price) : 0;

          if (
            typeof variant.size !== 'string' ||
            Number.isNaN(variant.stock) || variant.stock < 0
          ) {
            throw new Error('Invalid variant entry');
          }
        }
      } catch (err) {
        return res.status(400).json({ success: false, message: 'Invalid variants data' });
      }
    }

    // Update fields
    product.name = name ?? product.name;
    product.brand = brand ?? product.brand;
    product.description = description ?? product.description;
    product.price = price !== undefined ? Number(price) : product.price;
    product.mrpPrice = mrpPrice !== undefined ? Number(mrpPrice) : product.mrpPrice;
    product.discount = discount !== undefined ? Number(discount) : product.discount;
    product.category = category ?? product.category;
    product.subCategory = subCategory ?? product.subCategory;
    product.featured = featured !== undefined ? featured === 'true' : product.featured;
    product.bestseller = bestseller !== undefined ? bestseller === 'true' : product.bestseller;
    product.images = updatedImages;
    product.variants = parsedVariants;

    await product.save();
    res.json({ success: true, message: 'Product updated successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: error.message });
  }
};


const addReview = async(req,res)=>{
  try {
   const userId = req.userId;
    const {rating,comment,productId} = req.body

    if(!rating){
      return res.status(401).json({success: false, message:"Select a rating.!"})
    }
    const product = await productModel.findById(productId)


    if(!product){
      return res.status(401).json({
        success: false,
        message: "Product Not Found"
      })
    }
    const existingReview = await reviewModel.findOne({productId:productId, userId : userId})

    if(existingReview){
      return res.status(401).json({
        success: false,
        message: "You already review this product"
      })
    }

    const review = await reviewModel.create({
productId,
userId,
rating,
comment
    });

    const save = await review.save()
// Recalculate product rating
//   await productModel.findByIdAndUpdate(productId, {
//   $push: { review: review._id } // ✅ Should be _id ONLY
// });


    const allReviews = await reviewModel.find({ productId });
    const totalRating = allReviews.reduce((sum, r) => sum + r.rating, 0);
const avgRating = parseFloat((totalRating / allReviews.length).toFixed(1));


    // Update product rating
    product.rating = avgRating;
    await product.save();


  res.status(201).json({ message: "Review added successfully" });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};


const removeReview = async (req, res) => {
  try {
    const userId = req.userId;
    const { productId } = req.body;


    const review = await reviewModel.findOne({ productId, userId });
    if (!review) {
      return res.status(404).json({
        success: false,
        message: "Review not found"
      });
    }

  
    await reviewModel.findByIdAndDelete(review._id);

  
    const product = await productModel.findByIdAndUpdate(
      productId,
      { $pull: { review: review._id } },
      { new: true }
    );


    const remainingReviews = await reviewModel.find({ productId });

    let avgRating = 0;
    if (remainingReviews.length > 0) {
      const totalRating = remainingReviews.reduce((sum, r) => sum + r.rating, 0);
      avgRating = parseFloat((totalRating / remainingReviews.length).toFixed(1));
    }

    product.rating = avgRating;
    await product.save();

    res.status(200).json({ message: "Review Removed" });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};


const searchProduct = async (req, res) => {
  try {
    const search = req.query.search?.trim().toLowerCase();

    if (!search) {
      return res.json({ productLength: 0, success: true, foundProduct: [] });
    }

    const genderKeywords = ['men', 'women', 'unisex'];
    let gender = null;

    const keywords = search.split(/\s+/);

    
    for (const word of keywords) {
      if (genderKeywords.includes(word)) {
        gender = word;
        break;
      }
    }

    
    const remainingKeywords = keywords.filter(word => word !== gender);

    
    const query = {
      $and: []
    };

    
    if (gender) {
      query.$and.push({ category: new RegExp(`^${gender}$`, 'i') });
    }

    // Add name/category/subCategory matching for remaining words
    remainingKeywords.forEach(word => {
      query.$and.push({
        $or: [
          { name: { $regex: word, $options: 'i' } },
          { category: { $regex: word, $options: 'i' } },
          { subCategory: { $regex: word, $options: 'i' } }
        ]
      });
    });

   
    if (query.$and.length === 0) {
      const all = await productModel.find({});
      return res.json({ success: true, foundProduct: all, productLength: all.length });
    }

    const foundProduct = await productModel.find(query);
    return res.json({ success: true, foundProduct, productLength: foundProduct.length });

  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};






export const toggleLike = async (req, res) => {
  const userId = req.userId;
  const { productId } = req.body;

  try {
    const existing = await likedProductModel.findOne({ userId, productId });

    if (existing) {
      await likedProductModel.deleteOne({ _id: existing._id });

   
      await userModel.findByIdAndUpdate(userId, {
        $pull: { likedProduct: existing._id }
      });

      return res.json({ message: 'Disliked', liked: false });
    }

    const like = new likedProductModel({ userId, productId });
    await like.save();

    
    await userModel.findByIdAndUpdate(userId, {
      $addToSet: { likedProduct: like._id } 
    });

    return res.json({ message: 'Liked', liked: true });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
};




export const syncLikes = async (req, res) => {
  const userId = req.userId;
  const { likedItems } = req.body;

  if (!userId) {
    return res.status(400).json({ success: false, message: 'Provide User Id' });
  }

  try {
    const productIds = Object.keys(likedItems).filter(id => likedItems[id]);
    const likedProductIds = [];

    for (const productId of productIds) {
      const liked = await likedProductModel.findOneAndUpdate(
        { userId, productId },
        { $setOnInsert: { userId, productId } },
        { upsert: true, new: true }
      );

      likedProductIds.push(liked._id);
    }

    
    await userModel.findByIdAndUpdate(userId, {
      $addToSet: {
        likedProduct: { $each: likedProductIds }
      }
    });

    return res.json({
      success: true,
      message: 'Synced liked items',
      likedProductIds
    });
  } catch (err) {
    return res.status(500).json({ success: false, error: err.message });
  }
};


export const getUserLikedProducts = async (req, res) => {
  const userId = req.userId;

  if (!userId) {
    return res.status(401).json({ success: false, message: "Unauthorized" });
  }

  try {
    const likedProducts = await likedProductModel
      .find({ userId })
      .select("productId"); 

    return res.json({
      success: true,
      likedProducts, 
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: "Failed to fetch liked products",
      error: err.message,
    });
  }
};






export {addProduct,removeProduct,listProducts,singleProduct,updateProduct,addReview,removeReview, searchProduct}