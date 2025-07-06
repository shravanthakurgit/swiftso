import mongoose from "mongoose";

// Define a variant sub-schema for size + stock (and optional price override)
const variantSchema = new mongoose.Schema(
  {
    size: {
      type: String,
      required: true,
      trim: true
    },
    stock: {
      type: Number,
      required: true,
      min: 0
    },
    // Optional: allow price override per size
    price: {
      type: Number
    }
  },
  { _id: false }
);

const productSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  brand: {
    type: String,
    default: 'Unknown',
    trim: true
  },
  description: {
    type: String,
    required: true
  },
  price: {
    type: Number,
    required: true
  },
  mrpPrice: {
    type: Number,
    required: true
  },
  images: {
    type: [String],
    required: true
  },
  variants: {
    type: [variantSchema],
    required: true,
    default: []
  },
  category: {
    type: String,
    enum: ['men', 'women', 'kids'],
    required: true
  },
  subCategory: {
    type: String,
    enum: ['topwear', 'bottomwear', 'innerwear', 'winterwear'],
    required: true
  },
  featured: {
    type: Boolean,
    default: false
  },
  bestseller: {
    type: Boolean,
    default: false
  },

       rating: {
    type: Number,
    default : null
  },
  
},{timestamps:true});

productSchema.index({ _id: 1, 'variants.size': 1 }, { unique: true });

productSchema.virtual('reviews', {
  ref: 'review',
  localField: '_id',
  foreignField: 'productId'
});

productSchema.set('toObject', { virtuals: true });
productSchema.set('toJSON', { virtuals: true });


const productModel =
  mongoose.models.product || mongoose.model('product', productSchema);

export default productModel;
