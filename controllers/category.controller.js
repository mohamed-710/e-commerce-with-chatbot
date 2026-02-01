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
    const existCategory = await Category.findOne({ name: name });
    if (existCategory)
        return next(appError.create("Category already exists", 400, httpStatusText.FAIL));
    if (!req.file)
        return next(appError.create("Image file is required", 400, httpStatusText.FAIL));

    const { public_id, secure_url } = await cloudinary.uploader.upload(
        req.file.path,
        { folder: `${process.env.CLOUD_FOLDER_NAME}/category` },
    );
    console.log("Cloudinary upload result:", { public_id, secure_url });

    await Category.create({
        name: name,
        slug: slugify(name),
        createdBy: req.user._id,
        image: {
            publicId: public_id,
            secure_url: secure_url,
        },
    });

    res.status(201).json({ success: true, message: "Category created" });
});

const updateCategory = asyncWrapper(async (req, res, next) => {

    //check if category exists
    const category = await Category.findById(req.params.id);
    if (!category)
        return next(appError.create("Category not found", 404, httpStatusText.FAIL));
    //check categor owner
    if (req.user._id.toString() !== category.createdBy.toString())
        return next(appError.create("You are not authorized to update this category", 403, httpStatusText.FAIL));
    //check file >>> upload in cloudinary
    if (req.file) {
        const { public_id, secure_url } = await cloudinary.uploader.upload(
            req.file.path,
            { public_id: category.image.publicId }
        );
        category.image = {
            publicId: public_id,
            secure_url: secure_url,
        };
    }
    category.name = req.body.name ? req.body.name : category.name;
    category.slug = req.body.name ? slugify(req.body.name) : category.slug;
    await category.save();

    //return response
    return res.json({ success: true, message: "Category updated" });

});

export { createCategory, updateCategory };