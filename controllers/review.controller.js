import Review from "../models/review.js";
import { asyncWrapper } from "../utils/asyncHandler.js";
import appError from "../utils/appError.js";
import httpStatusText from "../utils/httpStatusText.js";
import { calcAverageRating } from "../services/review.service.js";
import Order from "../models/order.js";

const createReview = asyncWrapper(async (req, res, next) => {
    const { productId } = req.params;

    const { rating, feedback } = req.body;

    const order = await Order.findOne({
        user: req.user._id,
        "items.productId": productId,
        orderStatus: "delivered"
    });

    if (!order) {
        return next(appError.create("You can not review this product", 400, httpStatusText.FAIL));
    }

    if (await Review.findOne({
        createdBy: req.user._id,
        productId: productId,
        orderId: order._id
    }))
        return next(appError.create("You already reviewed this product", 400, httpStatusText.FAIL));

    const review = await Review.create({
        createdBy: req.user._id,
        productId: productId,
        rating,
        feedback,
        orderId: order._id
    });

    await calcAverageRating(productId);

    res.status(201).json({
        success: true,
        message: "Review created successfully",
        review
    });
});
const updateReview = asyncWrapper(async (req, res, next) => {
    const { reviewId } = req.params;
    const { rating, feedback } = req.body;

    console.log(reviewId);

    //check if review created by user
    const review = await Review.findOneAndUpdate({
        _id: reviewId,
        createdBy: req.user._id
    },
        { rating, feedback },
        { new: true });
    console.log(review);

    if (!review) {
        return next(appError.create("Review not found", 404, httpStatusText.FAIL));
    }
    await calcAverageRating(review.productId);
    res.status(200).json({
        success: true,
        message: "Review updated successfully",
        review
    });
});
export { createReview, updateReview };
