import mongoose from "mongoose";

const orderSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },

    items: [
        {
            productId: {
                type: mongoose.Schema.Types.ObjectId,
                ref: "Product"
            },
            name: String,
            quantity: { type: Number, min: 1 },
            unitPrice: {
                type: Number,
                required: true
            },

            productDiscount: {
                type: Number,
                default: 0
            },

            finalUnitPrice: {
                type: Number,
                required: true
            },

            lineTotal: {
                type: Number,
                required: true
            }
        }
    ],
    coupon: {
        id: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Coupon"
        },
        name: String,
        discount: {
            type: Number,
            min: 0,
            max: 100
        }
    },

    phone: { type: String, required: true },

    address: { type: String, required: true },

    invoice: {
        public_id: String,
        secure_url: String
    },

    paymentMethod: {
        type: String,
        enum: ["cash", "card"],
        default: "cash"
    },
    paymentStatus: {
        type: String,
        enum: ["pending", "paid", "failed"],
        default: "pending"
    },
    isPaid: {
        type: Boolean,
        default: false
    },

    orderStatus: {
        type: String,
        enum: ["placed", "shipped", "delivered", "cancelled", "refunded"],
        default: "placed"
    },
    isDelivered: {
        type: Boolean,
        default: false
    },
    paidAt: Date,
    deliveredAt: Date,
    subtotal: Number,
    totalPrice: Number,
    shippingPrice: Number,
}, { timestamps: true, toJSON: { virtuals: true }, toObject: { virtuals: true } });

export default mongoose.model("Order", orderSchema);
