import joi from "joi";
import { isValidObjectId } from "../middlewares/validation.js";
export const ValidateCategorySchema=joi.object({
    name:joi.
    string()
    .min(5)
    .max(20)
    .required(),
}).required();

export const UpdateCategorySchema=joi.object({
    name:joi.string().min(5).max(20),
    id:joi.string().custom(isValidObjectId).required(),
}).required();