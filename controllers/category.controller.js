import appError from "../utils/appError.js";
import { asyncWrapper } from "../utils/asyncHandler.js";
import httpStatusText from "../utils/httpStatusText.js";
import cloudinary from "../config/cloud.js";
import slugify from "slugify";
export const createCategory = asyncWrapper(async (req, res, next) => {
    //Logic for creating a category
    //name slug createdBy image
    //check file
    if(!req.file)
        return next(appError.create("Image file is required", 400 ,httpStatusText.FAIL));

    const {public_id,secure_url}=await cloudinary.uploader.upload(
        req.file.path,
        {folder:`${process.env.CLOUD_FOLDER_NAME}/category`},
    );
     
    await Category.create({
        name:req.body.name,
        slug:slugify(req.body.name),
        createdBy:req.user._id,
        image:{
            id:public_id,
            url:secure_url,
        },
    });

    res.status(201).json({ success: true, message: "Category created" });
});