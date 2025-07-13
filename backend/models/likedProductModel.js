import mongoose from 'mongoose';

const likeSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'user', required: true },
  productId: { type: mongoose.Schema.Types.ObjectId, ref: 'product', required: true },
}, { timestamps: true });

likeSchema.index({ userId: 1, productId: 1 }, { unique: true }); 

export default mongoose.model('likedProduct', likeSchema);
