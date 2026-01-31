import appError from "../utils/appError.js";
import { asyncWrapper } from "../utils/asyncHandler.js";
import httpStatusText from "../utils/httpStatusText.js";
import cloudinary from "../config/cloud.js";
import slugify from "slugify";
import Category from "../models/Category.js";
const createCategory = asyncWrapper(async (req, res, next) => {
    //Logic for creating a category
    //name slug createdBy image
    //check file
    const { name } = req.body;
    const existCategory=await Category.findOne({name:name});
    if(existCategory)
        return next(appError.create("Category already exists", 400 ,httpStatusText.FAIL));
    if(!req.file)
        return next(appError.create("Image file is required", 400 ,httpStatusText.FAIL));

    const {public_id,secure_url}=await cloudinary.uploader.upload(
        req.file.path,
        {folder:`${process.env.CLOUD_FOLDER_NAME}/category`},
    );
     console.log("Cloudinary upload result:", {public_id, secure_url});
    
    await Category.create({
        name:name,
        slug:slugify(name),
        createdBy:req.user._id,
        image:{
            publicId:public_id,
            secure_url:secure_url,
        },
    });

    res.status(201).json({ success: true, message: "Category created" });
});

export { createCategory };