import joi from "joi";
import { isValidObjectId } from "../middlewares/validation.js";

// ─── Create Order ─────────────────────────────────────────────────────────────
export const createOrderSchema = joi
    .object({
        phone: joi.string().required().messages({
            "string.empty": "Phone number is required",
            "any.required": "Phone number is required",
        }),
        address: joi.string().required().messages({
            "string.empty": "Shipping address is required",
            "any.required": "Shipping address is required",
        }),
        paymentMethod: joi
            .string()
            .valid("cash", "card")
            .required()
            .messages({
                "any.only": "Payment method must be either 'cash' or 'card'",
                "any.required": "Payment method is required",
            }),
        coupon: joi.string().optional().allow(""),
    })
    .required();

// // ─── Update Order Status (Admin) ─────────────────────────────────────────────
// export const updateOrderStatusSchema = joi
//     .object({
//         orderId: joi.string().custom(isValidObjectId).required(),
//         orderStatus: joi
//             .string()
//             .valid("placed", "shipped", "delivered", "cancelled", "refunded")
//             .optional(),
//         paymentStatus: joi
//             .string()
//             .valid("pending", "paid", "failed")
//             .optional(),
//     })
//     .or("orderStatus", "paymentStatus") // at least one must be provided
//     .required();

// // ─── Cancel / Get single order (by orderId param) ───────────────────────────
// export const orderIdParamSchema = joi
//     .object({
//         orderId: joi.string().custom(isValidObjectId).required().messages({
//             "any.required": "Order ID is required",
//         }),
//     })
//     .required();