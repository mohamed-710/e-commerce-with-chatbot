import mongoose from "mongoose"
const brandSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        unique: true,
        min: 2, 
        max: 12
    },
    slug: {
        type: String,
        required: true,
        unique: true,
    },
    image: {
        publicId: { type: String },
        secure_url: { type: String }
    },
    createBy: {
        type:mongoose.Schema.Types.ObjectId,
        ref:"User",
        required:true
    }
},
    { timestamps: true }
);
brandSchema.virtual("catigories",{
    ref:"Category",
    localField:"_id",
    foreignField:"brands"
});
brandSchema.virtual("subcategories",{
    ref:"Subcategory",
    localField:"_id",
    foreignField:"brands"
});

const Brand = mongoose.model("Brand", brandSchema);
export default Brand;