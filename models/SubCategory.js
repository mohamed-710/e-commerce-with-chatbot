import mongoose from "mongoose";
const SubcategorySchema = mongoose.Schema({
    name: {
        type: String,
        required: true,
        unique: true,
        min: 5,
        max: 20
    },
    slug: {
        type: String,
        required: true,
        unique: true,
    },
    createdBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    updatedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
    },

    image: {
        publicId: { type: String },
        secure_url: { type: String }
    },
    category: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Category",
        required: true
    },
    brands: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Brand",
    }],
},
    { timestamps: true }
);
const Subcategory = mongoose.model("Subcategory", SubcategorySchema);
export default Subcategory;