import mongoose from "mongoose";

const productSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        min: 3,
        max: 100,
        trim: true
    },
    slug: {
        type: String,
        required: true,
        unique: true,
    },
    description: {
        type: String,
        required: true,
        min: 10,
        max: 2000
    },
    price: {
        type: Number,
        required: true,
        min: 0
    },
    discount: {
        type: Number,
        default: 0,
        min: 0,
        max: 100
    },
    thumbnail: {
        publicId: { type: String, required: true },
        secure_url: { type: String, required: true }
    },
    stock: {
        type: Number,
        required: true,
        default: 1,
        min: 1
    },
    soldItems: {
        type: Number,
        default: 0,
    },
    createdBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    category: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Category",
        required: true
    },
    subcategory: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Subcategory",
        required: true
    },
    brand: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Brand",
        required: true
    },
    cloudFolder: {
        type: String,
        required: true,
        unique: true
    },
    images: [
        {
            publicId: { type: String, required: true },
            secure_url: { type: String, required: true }
        }
    ],
    averageRating: {
        type: Number,
        default: 0,
        min: 0,
        max: 5
    },

    reviewsCount: {
        type: Number,
        default: 0
    }
},
    { timestamps: true, toJSON: { virtuals: true }, toObject: { virtuals: true }, strictQuery: true }
);

productSchema.virtual("finalPrice").get(function () {
    const priceAfterDiscount = this.price - (this.price * (this.discount || 0) / 100);
    return Math.round(priceAfterDiscount * 100) / 100;
});
productSchema.virtual("availableStock").get(function () {
    return this.stock - this.soldItems;
});

productSchema.virtual("reviews", {
    ref: "Review",
    localField: "_id",
    foreignField: "productId"
})

productSchema.query.paginate = function (page) {
    page = page < 1 || isNaN(page) || !page ? 1 : page;
    const limit = 3;
    const skip = (page - 1) * limit;
    return this.skip(skip).limit(limit);
}
productSchema.query.search = function (keyword) {
    if (keyword) {
        return this.find({
            $or: [
                { name: { $regex: keyword, $options: "i" } },
                { description: { $regex: keyword, $options: "i" } }
            ]
        })
    }
    return this;
}

productSchema.methods.inStock = function (requiredQuantity) {
    const available = this.stock - (this.soldItems || 0);
    return available >= requiredQuantity;
}
const Product = mongoose.model("Product", productSchema);
export default Product;
