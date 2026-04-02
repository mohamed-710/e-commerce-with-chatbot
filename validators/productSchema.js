import joi from "joi";
import { isValidObjectId } from "../middlewares/validation.js";

export const createProductSchema = joi.object({
    name: joi.string().min(3).max(100).trim().required()
        .messages({
            "string.min": "Product name must be at least 3 characters",
            "string.max": "Product name must not exceed 100 characters",
            "any.required": "Product name is required",
        }),

    description: joi.string().min(10).max(2000).required()
        .messages({
            "string.min": "Description must be at least 10 characters",
            "string.max": "Description must not exceed 2000 characters",
            "any.required": "Description is required",
        }),

    price: joi.number().integer().min(0).required()
        .messages({
            "number.min": "Price cannot be negative",
            "any.required": "Price is required",
        }),

    discount: joi.number().min(0).max(100).default(0)
        .messages({
            "number.min": "Discount cannot be negative",
            "number.max": "Discount cannot exceed 100%",
        }),

    stock: joi.number().integer().min(1).required()
        .messages({
            "number.min": "Stock must be at least 1",
            "any.required": "Stock is required",
        }),

    category: joi.string().custom(isValidObjectId).required()
        .messages({ "any.required": "Category is required" }),

    subcategory: joi.string().custom(isValidObjectId).required()
        .messages({ "any.required": "Subcategory is required" }),

    brand: joi.string().custom(isValidObjectId).required()
        .messages({ "any.required": "Brand is required" }),
}).required();

export const updateProductSchema = joi.object({
    id: joi.string().custom(isValidObjectId).required()
        .messages({ "any.required": "Product id is required" }),


    name: joi.string().min(3).max(100).trim()
        .messages({
            "string.min": "Product name must be at least 3 characters",
            "string.max": "Product name must not exceed 100 characters",
        }),

    description: joi.string().min(10).max(2000)
        .messages({
            "string.min": "Description must be at least 10 characters",
            "string.max": "Description must not exceed 2000 characters",
        }),

    price: joi.number().min(0)
        .messages({ "number.min": "Price cannot be negative" }),

    discount: joi.number().min(0).max(100)
        .messages({
            "number.min": "Discount cannot be negative",
            "number.max": "Discount cannot exceed 100%",
        }),

    stock: joi.number().integer().min(1)
        .messages({ "number.min": "Stock must be at least 1" }),
}).required();

export const deleteProductSchema = joi.object({
    id: joi.string().custom(isValidObjectId).required()
        .messages({ "any.required": "Product id is required" }),
}).required();
