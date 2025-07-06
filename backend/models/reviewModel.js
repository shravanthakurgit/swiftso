import mongoose from 'mongoose'

const reviewSchema = new mongoose.Schema({

    userId :{
        type : mongoose.Schema.ObjectId,
        ref : "user",
        required : true
    },
    productId : {
        type : mongoose.Schema.ObjectId,
        ref: "product",
        required : true
    },

     rating:{
        type : Number,
        required: true
    },
     comment:{
        type : String,
    },

},{timestamps: true})

const reviewModel = mongoose.model('review', reviewSchema)

export default reviewModel;