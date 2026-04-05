import joi from "joi";
import { isValidObjectId } from "../middlewares/validation.js"; 

export const addToCartSchema = joi.object({
    productId: joi.string().custom(isValidObjectId).required(),
    quantity: joi.number().integer().min(1).required()
});

