import joi from "joi";
import { isValidObjectId } from "../middlewares/validation.js";
export const createSubCategorySchema = joi.object({
    category: joi.string().custom(isValidObjectId).required(),
    name: joi.
        string()
        .min(5)
        .max(20)
        .required(),
}).required();
export const deleteSubCategorySchema  = joi.object({
    id: joi.string().custom(isValidObjectId).required(),
    category: joi.string().custom(isValidObjectId).required(),
});
export const UpdateSubCategorySchema=joi.object({
    name:joi.string().min(5).max(20),
    id:joi.string().custom(isValidObjectId).required(),
    category: joi.string().custom(isValidObjectId).required(),
}).required();
export const allSubCategoriesSchema  = joi.object({
    category: joi.string().custom(isValidObjectId)
});
