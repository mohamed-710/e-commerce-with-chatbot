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
    brands:[{
        type:mongoose.Schema.Types.ObjectId,
        ref:"Brand",
    }],
    updatedBy:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User",
    },
    image:{
        publicId:{type:String},
        secure_url:{type:String}
    },
},
{timestamps:true,toJSON:{virtuals:true},tObject:{virtuals:true}}
);
categorySchema.virtual("subcategory",{
    ref:"Subcategory",
    localField:"_id",//category
    foreignField:"category",//subcategpry  
});
const Category=mongoose.model("Category",categorySchema);
export default Category;
