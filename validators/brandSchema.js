import joi from "joi";
import { isValidObjectId } from "../middlewares/validation.js";
export const createBrandSchema = joi.object({
    name: joi.string().min(2).max(20).required(),
    categories: joi.array().items(joi.string().custom(isValidObjectId)).required(),
}).required();
export const updateBrandSchema = joi.object({
    name: joi.string().min(2).max(20),
    id: joi.string().custom(isValidObjectId).required(),
}).required();
export const deleteBrandSchema = joi.object({
    id: joi.string().custom(isValidObjectId).required()
}).required();