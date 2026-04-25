import Joi from "joi";
import { isValidObjectId } from "../middlewares/validation.js";

const createReviewSchema = Joi.object({
    productId: Joi.string().custom(isValidObjectId).required(),
    rating: Joi.number().min(1).max(5).required(),
    feedback: Joi.string().required(),
}).required();

const updateReviewSchema = Joi.object({
    reviewId: Joi.string().custom(isValidObjectId).required(),
    rating: Joi.number().min(1).max(5),
    feedback: Joi.string(),
}).required();

export { createReviewSchema, updateReviewSchema };