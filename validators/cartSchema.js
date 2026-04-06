import joi from "joi";
import { isValidObjectId } from "../middlewares/validation.js"; 

export const addToCartSchema = joi.object({
    productId: joi.string().custom(isValidObjectId).required(),
    quantity: joi.number().integer().min(1).required()
});

//make get cart schema 

export const getCartSchema = joi.object({
    cartId: joi.string().custom(isValidObjectId).optional()
});
// for admin when get cart cartid

