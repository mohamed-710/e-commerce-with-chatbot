import mongoose from "mongoose";

const reviewSchema = new mongoose.Schema({
    createdBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    productId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Product",
        required: true
    },
    rating: {
        type: Number,
        required: true,
        min: 1,
        max: 5
    },
    feedback: {
        type: String,
        required: true
    },
    orderId:{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Order",
        required: true
    }
}, { timestamps: true });


const Review = mongoose.model("Review", reviewSchema);

export default Review;