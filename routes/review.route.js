import express from "express";
import { createReview ,updateReview} from "../controllers/review.controller.js";
import { verifyToken } from "../middlewares/verifyToken.js";
import { isAuthorized } from "../middlewares/allowedTo.js";
import { validation } from "../middlewares/validation.js";
import { createReviewSchema,updateReviewSchema } from "../validators/reviewSchema.js";

const router = express.Router({mergeParams:true});


router.post(
    "/",
    verifyToken,
    isAuthorized("user"),
    validation(createReviewSchema),
    createReview,
);

// router.delete(
//     "/:reviewId",
//     verifyToken,
//     isAuthorized("user"),
//     deleteReview,
// );
router.patch(
    "/:reviewId",
    verifyToken,
    isAuthorized("user"),
    // validation(updateReviewSchema),
    updateReview,
);
export default router;