import mongoose from "mongoose";
const categorySchema=mongoose.Schema({
    name:{
        type:String,
        required:true,
        unique:true,
        min:5,
        max:20
    },
    slug:{
        type:String,
        required:true,
        unique:true,
    },
    createdBy:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User",
        required:true
    },
    image:{
        publicId:{type:String},
        secure_url:{type:String}
    },
},
{timestamps:true}
);
const Category=mongoose.model("Category",categorySchema);
export default Category;
