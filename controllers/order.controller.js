import { asyncWrapper } from "../utils/asyncHandler.js";
import appError from "../utils/appError.js";
import httpStatusText from "../utils/httpStatusText.js";
import Order from "../models/order.js";
import Cart from "../models/Cart.js";
import Product from "../models/product.js";
import Coupon from "../models/coupon.js";
import User from "../models/user.js";
import cloudinary from "../config/cloud.js";
import createInvoice from "../utils/pdfInvoice.js";
import { sendEmail } from "../utils/sendEmails.js";
import fs from "fs";
import path from "path";

const buildInvoicePayload = (order, user) => ({
    invoice_nr: order._id.toString().slice(-6).toUpperCase(),
    shipping: {
        name: user.userName,
        address: order.address,
        city: "",
        state: "",
        country: "",
    },
    items: order.items.map((item) => ({
        item: item.name,
        description: item.name,
        quantity: item.quantity,
        amount: item.itemPrice * item.quantity * 100, // pdfInvoice uses cents
    })),
    subtotal: order.subtotal * 100,
    paid: order.isPaid ? order.totalPrice * 100 : 0,
});


export const createOrder = asyncWrapper(async (req, res, next) => {
    const { phone, address, paymentMethod, coupon: couponCode } = req.body;

    let checkCoupon;
    if(couponCode){
        checkCoupon=await Coupon.findOne({name:couponCode});
        console.log("Coupon found:", checkCoupon);
        if(!checkCoupon){
            return next(appError.create("Invalid or expired coupon", 400, httpStatusText.FAIL));
        }
    }

    const cart = await Cart.findOne({ user: req.user._id }).populate(
        "items.productId",
        "name price discount stock soldItems"
    );
   
    if (!cart || cart.items.length === 0)
        return next(appError.create("Your cart is empty", 400, httpStatusText.FAIL));

    // 2. Validate stock & build order items (snapshot)
    const orderItems = [];
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

        orderItems.push({
            productId: product._id,
            name: product.name,
            itemPrice: product.finalPrice,
            quantity: cartItem.quantity,
        });
    }
    
    // const subtotal = orderItems.reduce(
    //     (sum, item) => sum + item.itemPrice * item.quantity,
    //     0
    // );

    // // 4. Coupon (optional)
    // let couponDoc = null;
    // let discountAmount = 0;
    // if (couponCode) {
    //     couponDoc = await Coupon.findOne({
    //         name: couponCode,
    //         expiredAt: { $gt: new Date() },
    //     });
    //     if (!couponDoc)
    //         return next(appError.create("Invalid or expired coupon", 400, httpStatusText.FAIL));
    //     discountAmount = subtotal * (couponDoc.discount / 100);
    // }

    // // 5. Totals
    // const SHIPPING_PRICE = 0; // free shipping — adjust as needed
    // const totalPrice = Math.max(0, subtotal - discountAmount) + SHIPPING_PRICE;

    // // 6. Create the Order document
    // const orderData = {
    //     user: req.user._id,
    //     items: orderItems,
    //     phone,
    //     address,
    //     paymentMethod,
    //     subtotal: parseFloat(subtotal.toFixed(2)),
    //     shippingPrice: SHIPPING_PRICE,
    //     totalPrice: parseFloat(totalPrice.toFixed(2)),
    // };

    // if (couponDoc) {
    //     orderData.coupon = {
    //         id: couponDoc._id,
    //         name: couponDoc.name,
    //         discount: couponDoc.discount,
    //     };
    // }

    // const order = await Order.create(orderData);

    // // 7. Generate PDF invoice to a temp file
    // const invoicePath = path.join("invoices", `${order._id}.pdf`);
    // // Ensure directory exists
    // if (!fs.existsSync("invoices")) fs.mkdirSync("invoices");

    // const user = await User.findById(req.user._id).select("userName email");
    // createInvoice(buildInvoicePayload(order, user), invoicePath);

    // // Small delay to allow PDFKit to flush (doc.end() is sync-ish)
    // await new Promise((resolve) => setTimeout(resolve, 500));

    // // 8. Upload invoice PDF to Cloudinary
    // let invoiceData = {};
    // try {
    //     const uploadResult = await cloudinary.uploader.upload(invoicePath, {
    //         folder: `${process.env.CLOUD_FOLDER_NAME}/invoices`,
    //         resource_type: "raw",
    //         public_id: `invoice_${order._id}`,
    //     });
    //     invoiceData = {
    //         public_id: uploadResult.public_id,
    //         secure_url: uploadResult.secure_url,
    //     };
    //     // Clean up local temp file
    //     fs.unlinkSync(invoicePath);
    // } catch (uploadErr) {
    //     // Non-blocking — order is already created, just skip invoice upload
    //     console.error("Invoice upload failed:", uploadErr.message);
    // }

    // // 9. Save invoice URL in Order
    // if (invoiceData.secure_url) {
    //     order.invoice = invoiceData;
    //     await order.save();
    // }

    // // 10. Send invoice email to user
    // try {
    //     await sendEmail({
    //         to: user.email,
    //         subject: "Your Order Confirmation 🛍️",
    //         html: `
    //             <h2>Thank you for your order, ${user.userName}!</h2>
    //             <p>Your order <strong>#${order._id}</strong> has been placed successfully.</p>
    //             <p><strong>Total:</strong> $${order.totalPrice.toFixed(2)}</p>
    //             <p><strong>Payment Method:</strong> ${order.paymentMethod}</p>
    //             <p><strong>Shipping Address:</strong> ${order.address}</p>
    //             ${invoiceData.secure_url
    //                 ? `<p><a href="${invoiceData.secure_url}">📄 Download Your Invoice</a></p>`
    //                 : ""
    //             }
    //             <hr/>
    //             <small>If you did not place this order, please contact our support team immediately.</small>
    //         `,
    //     });
    // } catch (emailErr) {
    //     console.error("Invoice email failed:", emailErr.message);
    // }

    // // 11. Update product stock
    // const stockUpdates = orderItems.map((item) =>
    //     Product.findByIdAndUpdate(item.productId, {
    //         $inc: { soldItems: item.quantity },
    //     })
    // );
    // await Promise.all(stockUpdates);

    // // 12. Clear the cart
    // await Cart.findOneAndUpdate(
    //     { user: req.user._id },
    //     { $set: { items: [] } }
    // );

    // return res.status(201).json({
    //     success: true,
    //     message: "Order placed successfully",
    //     results: {
    //         orderId: order._id,
    //         totalPrice: order.totalPrice,
    //         orderStatus: order.orderStatus,
    //         invoice: order.invoice,
    //     },
    // });
});

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

// // ─── Cancel Order (User/Admin) ───────────────────────────────────────────────

// export const cancelOrder = asyncWrapper(async (req, res, next) => {
//     const { orderId } = req.params;

//     const order = await Order.findById(orderId);
//     if (!order)
//         return next(appError.create("Order not found", 404, httpStatusText.FAIL));

//     // Only the owner or an admin can cancel
//     if (
//         req.user.role === "user" &&
//         order.user.toString() !== req.user._id.toString()
//     )
//         return next(appError.create("Access denied", 403, httpStatusText.FAIL));

//     // Only cancellable if still placed or shipped
//     if (!["placed", "shipped"].includes(order.orderStatus))
//         return next(
//             appError.create(
//                 `Cannot cancel an order with status "${order.orderStatus}"`,
//                 400,
//                 httpStatusText.FAIL
//             )
//         );

//     order.orderStatus = "cancelled";
//     await order.save();

//     // Restore product stock
//     const stockRestores = order.items.map((item) =>
//         Product.findByIdAndUpdate(item.productId, {
//             $inc: { soldItems: -item.quantity },
//         })
//     );
//     await Promise.all(stockRestores);

//     return res.json({
//         success: true,
//         message: "Order cancelled successfully",
//         results: order,
//     });
// });
