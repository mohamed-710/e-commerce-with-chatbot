import { asyncWrapper } from "../utils/asyncHandler.js";
import appError from "../utils/appError.js";
import httpStatusText from "../utils/httpStatusText.js";
import cloudinary from "../config/cloud.js";
import slugify from "slugify";
import Subcategory from "../models/SubCategory.js";
import Category from "../models/Category.js";
const createSubCategory = asyncWrapper(async (req, res, next) => {
    //Logic for creating a subcategory
    //name slug createdBy image categoryId
    const { name } = req.body;
    const existSubcategory = await Subcategory.findOne({ name: name });
    if (existSubcategory)
        return next(appError.create("Existing Subcategory already exists", 400, httpStatusText.FAIL));
    const category = await Category.findById(req.params.category);
    if (!category)
        return next(appError.create("Category not found", 404, httpStatusText.FAIL));
    if (!req.file)
        return next(appError.create("Image file is required", 400, httpStatusText.FAIL));

    const { public_id, secure_url } = await cloudinary.uploader.upload(
        req.file.path,
        { folder: `${process.env.CLOUD_FOLDER_NAME}/subcategory` },
    );
    await Subcategory.create({
        name: name,
        slug: slugify(name),
        createdBy: req.user._id,
        image: {
            publicId: public_id,
            secure_url: secure_url,
        },
        category: req.params.category,
    });
    res.status(201).json({ success: true, message: "SubCategory created" })
});

const deleteSubCategory = asyncWrapper(async (req, res, next) => {
    //check category 
    const category = await Category.findById(req.params.category);
    if (!category) return next(appError.create("Category not found", 404, httpStatusText.ERROR))

    // check subcategory exist or not certain category 
    const subcategory = await Subcategory.findOne({
        _id: req.params.id,
        category: req.params.category
    });
    if (!subcategory)
        return next(appError.create("subcategory not found", 404, httpStatusText.ERROR));
    //check owner 
    console.log(
        subcategory.createdBy
    );
    console.log(
        req.user._id
    );

    if (subcategory.createdBy.toString() !== req.user._id.toString())
        return next(appError.create("Not allowed to delete!", 400, httpStatusText.FAIL));
    //delete subcategory
    await subcategory.deleteOne();
    //delete image from cloudinary
    await cloudinary.uploader.destroy(subcategory.image.publicId);
    return res.json({ success: true, message: "subcategory deleted successfully" });
});
const allSubCategories = asyncWrapper(async (req, res, next) => {
    //all subcategories of a certain category
    const filter=req.params.category?{category:req.params.category}:{};
    const results=await Subcategory.find(filter)
    return res.json({
        success:true,
        results
    });
});

const updateSubCategory = asyncWrapper(async (req, res, next) => {
    //check category
    const category = await Category.findById(req.params.category);
    if (!category) return next(appError.create("Category not found", 404, httpStatusText.ERROR))
    //check subcategory exist or not
    const subcategory = await Subcategory.findOne({
        _id: req.params.id,
        category: req.params.category
    });
    if (!subcategory)
        return next(appError.create("subcategory not found", 404, httpStatusText.ERROR));
    if (subcategory.createdBy.toString() !== req.user._id.toString())
        return next(appError.create("Not allowed to delete!", 400, httpStatusText.FAIL));
    // check file >>>> upload in cloudinary 
    if (req.file) {
        const { public_id, secure_url } = await cloudinary.uploader.upload(
            req.file.path,
            { public_id: subcategory.image.publicId }
        );
        subcategory.image = {
            publicId: public_id,
            secure_url: secure_url,
        };
    }
    //update subcategory
    subcategory.name = req.body.name ? req.body.name : subcategory.name;
    subcategory.slug = req.body.name ? slugify(req.body.name) : subcategory.slug;
    await subcategory.save();
    return res.json({
        success:true,
        meesage:"subcategory updated successfully!"
    });
});

export { createSubCategory, deleteSubCategory, allSubCategories, updateSubCategory };