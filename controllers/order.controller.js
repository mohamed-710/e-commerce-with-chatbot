import { asyncWrapper } from "../utils/asyncHandler.js";
import appError from "../utils/appError.js";
import httpStatusText from "../utils/httpStatusText.js";
import Order from "../models/order.js";
import Cart from "../models/Cart.js";
import Coupon from "../models/coupon.js";
import cloudinary from "../config/cloud.js";
import { updateStock, clearCart } from "../services/order.services.js";
import createInvoice from "../utils/pdfInvoice.js";
import { sendEmail } from "../utils/sendEmails.js";
import fs from "fs";
import path from "path";


export const createOrder = asyncWrapper(async (req, res, next) => {
    const { phone, address, paymentMethod, coupon: couponCode } = req.body;

    let couponDoc;
    if (couponCode) {
        couponDoc = await Coupon.findOne({ name: couponCode, expiredAt: { $gt: new Date() } });
        if (!couponDoc) {
            return next(appError.create("Invalid or expired coupon", 400, httpStatusText.FAIL));
        }
    }

    const cart = await Cart.findOne({ user: req.user._id }).populate(
        "items.productId",
        "name price discount stock soldItems"
    );

    if (!cart || cart.items.length === 0)
        return next(appError.create("Your cart is empty", 400, httpStatusText.FAIL));

    const orderItems = [];
    let subtotal = 0;
    for (const cartItem of cart.items) {
        const product = cartItem.productId;
        if (!product)
            return next(appError.create("One or more products no longer exist", 404, httpStatusText.FAIL));

        if (!product.inStock(cartItem.quantity))
            return next(
                appError.create(
                    `"${product.name}" only has ${product.availableStock} unit(s) available`,
                    400,
                    httpStatusText.FAIL
                )
            );

        const unitPrice = product.price;
        const productDiscount = product.discount || 0;
        const finalUnitPrice = unitPrice - (unitPrice * productDiscount / 100);
        const lineTotal = finalUnitPrice * cartItem.quantity;

        orderItems.push({
            productId: product._id,
            name: product.name,
            unitPrice,
            productDiscount,
            finalUnitPrice,
            quantity: cartItem.quantity,
            lineTotal

        });
        subtotal += lineTotal;
    }


    let discountAmount = 0;
    if (couponDoc) {
        discountAmount = subtotal * (couponDoc.discount / 100);
    }

    // const SHIPPING_PRICE = 0; // free shipping — adjust as needed
    // const totalPrice = Math.max(0, subtotal - discountAmount) + SHIPPING_PRICE;
    const totalPrice = subtotal - discountAmount;
    const orderData = {
        user: req.user._id,
        items: orderItems,
        phone,
        address,
        paymentMethod,
        subtotal,
        totalPrice,
        coupon: couponDoc
            ? {
                id: couponDoc._id,
                name: couponDoc.name,
                discount: couponDoc.discount
            }
            : {}

    };
    const order = await Order.create(orderData);
    const user = req.user;
    const invoice = {
        shipping: {
            name: user.userName,
            address: order.address,
            country: "Egypt",
        },
        items: order.items,
        subtotal: order.subtotal,
        totalPrice: order.totalPrice,
        invoice_nr: order._id
    };

    const pdfPath = path.join(process.cwd(), "tempInvoices", `${order._id}.pdf`);;

    if (!fs.existsSync(pdfPath)) {
        fs.mkdirSync(path.dirname(pdfPath), { recursive: true });
    }

    createInvoice(invoice, pdfPath);

    const { secure_url, public_id } = await cloudinary.uploader.upload(pdfPath, {
        folder: `${process.env.CLOUD_FOLDER_NAME}/orders/${order._id}`,
    });

    order.invoice = { secure_url, public_id };

    await order.save();

    const isSent = await sendEmail({
        to: user.email,
        subject: "Your Order Confirmation 🛍️",
        attachments: [{
            path: secure_url,
            filename: `invoice-${order._id}.pdf`,
            contentType: "application/pdf",
        }],
    });


    if (!isSent) {
        return next(appError.create("Failed to send order confirmation email", 400, httpStatusText.FAIL));
    };
    fs.unlinkSync(pdfPath);

    updateStock(order.items,true);

    clearCart(user._id);

    return res.status(201).json({
        success: true,
        message: "Order placed successfully",
        results: { order }
    });
});
export const cancelOrder = asyncWrapper(async (req, res, next) => {
    const {orderId} = req.params;
    const order = await Order.findById(orderId);
    if(!order){
        return next(appError.create("Order not found", 404, httpStatusText.FAIL));
    }

    
    if(order.user._id.toString() !== req.user._id.toString()){
        return next(appError.create("You are not authorized to cancel this order", 403, httpStatusText.FAIL));
    }
    if(order.orderStatus ==="delivered" ||
         order.orderStatus ==="shipped"|| 
         order.orderStatus ==="cancelled"){
        return next(appError.create("Order cannot be cancelled", 400, httpStatusText.FAIL));
    }
    order.orderStatus = "cancelled";
    await order.save();
    updateStock(order.items,false);
    return res.json({
        success: true,
        message: "Order cancelled successfully",
        results: {  
            orderId: order._id,
            status: order.orderStatus,
            totalPrice: order.totalPrice,
            cancelledAt: order.updatedAt,
        }
    });
        
})

// // ─── Get All Orders (Admin only) ─────────────────────────────────────────────

// export const getAllOrders = asyncWrapper(async (req, res, next) => {
//     const orders = await Order.find()
//         .populate("user", "userName email")
//         .sort({ createdAt: -1 });

//     return res.json({ success: true, results: orders });
// });

// // ─── Get My Orders (Authenticated user) ──────────────────────────────────────

// export const getMyOrders = asyncWrapper(async (req, res, next) => {
//     const orders = await Order.find({ user: req.user._id }).sort({ createdAt: -1 });
//     return res.json({ success: true, results: orders });
// });

// // ─── Get Single Order ─────────────────────────────────────────────────────────

// export const getOrderById = asyncWrapper(async (req, res, next) => {
//     const { orderId } = req.params;

//     const order = await Order.findById(orderId).populate("user", "userName email");
//     if (!order)
//         return next(appError.create("Order not found", 404, httpStatusText.FAIL));

//     // Users can only view their own orders; admins can view all
//     if (
//         req.user.role === "user" &&
//         order.user._id.toString() !== req.user._id.toString()
//     )
//         return next(appError.create("Access denied", 403, httpStatusText.FAIL));

//     return res.json({ success: true, results: order });
// });

// // ─── Update Order Status (Admin only) ────────────────────────────────────────

// export const updateOrderStatus = asyncWrapper(async (req, res, next) => {
//     const { orderId } = req.params;
//     const { orderStatus, paymentStatus } = req.body;

//     const order = await Order.findById(orderId);
//     if (!order)
//         return next(appError.create("Order not found", 404, httpStatusText.FAIL));

//     // Prevent updating a cancelled or refunded order
//     if (["cancelled", "refunded"].includes(order.orderStatus))
//         return next(
//             appError.create(
//                 `Cannot update an order with status "${order.orderStatus}"`,
//                 400,
//                 httpStatusText.FAIL
//             )
//         );

//     if (orderStatus) order.orderStatus = orderStatus;

//     if (orderStatus === "delivered") {
//         order.isDelivered = true;
//         order.deliveredAt = new Date();
//     }

//     if (paymentStatus) order.paymentStatus = paymentStatus;

//     if (paymentStatus === "paid") {
//         order.isPaid = true;
//         order.paidAt = new Date();
//     }

//     await order.save();

//     return res.json({
//         success: true,
//         message: "Order status updated successfully",
//         results: order,
//     });
// });

