import Brand from "../models/brand.js";
import Category from "../models/Category.js";
import { asyncWrapper } from "../utils/asyncHandler.js";
import appError from "../utils/appError.js";
import httpStatusText from '../utils/httpStatusText.js';
export const createBrand = asyncWrapper(async (req, res, next) => {
    //check category exist or not
    const { categories, name } = req.body;
    
    const categoryexist = await Category.find({
        _id: { $in: categories }
    });
    if (categoryexist.length !== categories.length)
        return next(new appError.create("some category not exist", 400, httpStatusText.FAIL));

    //file
    if(!req.file)
        return next(new appError.create("brand image is required",400,httpStatusText.FAIL));
    //upload file to cloudinary
    const {public_id,secure_url}=await cloudinary.uploader.upload(req.file.path,
        { folder: `${process.env.CLOUD_FOLDER_NAME}/brand`},
    );
    //save brand
    const brand =await Brand.create({
        name,
        slug:slugify(name),
        image:{publicId:public_id,secure_url},
        createBy:req.user._id
    });
    // save brand to category
    await Category.updateMany(
        {_id:{$in:categories}},
        {$push:{brands:brand._id}}
    );
    res.status(200).json({ status: "success", data: brand });
})