import { Router } from "express";
import {
    createOrder,
    cancelOrder
} from "../controllers/order.controller.js";
import { verifyToken } from "../middlewares/verifyToken.js";
import { isAuthorized } from "../middlewares/allowedTo.js";
import { validation } from "../middlewares/validation.js";
import {
    createOrderSchema,
    orderIdParamSchema
} from "../validators/orderSchema.js";

const router = Router();

router.post(
    "/create-order",
    verifyToken,
    isAuthorized("user"),
    validation(createOrderSchema),
    createOrder
);
router.patch(
    "/cancel/:orderId",
    verifyToken,
    isAuthorized("user"),
    validation(orderIdParamSchema),
    cancelOrder
);
// // GET /api/order/my-orders  — authenticated user only
// router.get(
//     "/my-orders",
//     verifyToken,
//     isAuthorized("user"),
//     getMyOrders
// );

// // GET /api/order/all-orders  — admin only
// router.get(
//     "/all-orders",
//     verifyToken,
//     isAuthorized("admin"),
//     getAllOrders
// );

// // GET /api/order/:orderId  — user (own) or admin
// router.get(
//     "/:orderId",
//     verifyToken,
//     isAuthorized(["user", "admin"]),
//     validation(orderIdParamSchema),
//     getOrderById
// );

// // PATCH /api/order/:orderId/status  — admin only
// router.patch(
//     "/:orderId/status",
//     verifyToken,
//     isAuthorized("admin"),
//     validation(updateOrderStatusSchema),
//     updateOrderStatus
// );

// // PATCH /api/order/:orderId/cancel  — user (own) or admin


export default router;
