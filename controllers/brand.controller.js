import Brand from "../models/brand.js";
import Category from "../models/Category.js";
import { asyncWrapper } from "../utils/asyncHandler.js";
import appError from "../utils/appError.js";
import httpStatusText from '../utils/httpStatusText.js';
import cloudinary from "../config/cloud.js";
import slugify from "slugify";
import Subcategory from "../models/SubCategory.js";
import mongoose from "mongoose";
export const createBrand = asyncWrapper(async (req, res, next) => {
    //check category exist or not
    const { categories, subcategories, name } = req.body;

    const categoryexist = await Category.find({
        _id: { $in: categories }
    });
    if (categoryexist.length !== categories.length)
        return next(appError.create("some category not exist", 400, httpStatusText.FAIL));

    if (subcategories && subcategories.length > 0) {
        const subcategoryexist = await Subcategory.find({ _id: { $in: subcategories } });
        if (subcategoryexist.length !== subcategories.length)
            return next(appError.create("some subcategory not exist", 400, httpStatusText.FAIL));
    }
    const nameExist = await Brand.findOne({ name: name });
    if (nameExist)
        return next(appError.create("brand name already exist", 400, httpStatusText.FAIL));
    //file
    if (!req.file)
        return next(appError.create("brand image is required", 400, httpStatusText.FAIL));
    //upload file to cloudinary
    const { public_id, secure_url } = await cloudinary.uploader.upload(req.file.path,
        { folder: `${process.env.CLOUD_FOLDER_NAME}/brand` },
    );
    //save brand
    const brand = await Brand.create({
        name,
        slug: slugify(name),
        image: { publicId: public_id, secure_url },
        createBy: req.user._id
    });
    // save brand to category
    await Category.updateMany(
        { _id: { $in: categories } },
        { $push: { brands: brand._id } }
    );
    if (subcategories && subcategories.length > 0) {
        await Subcategory.updateMany(
            { _id: { $in: subcategories } },
            { $addToSet: { brands: brand._id } }
        );
    }
    res.status(200).json({ status: "success", data: brand });
});

export const updateBrand = asyncWrapper(async (req, res, next) => {
    const brand = await Brand.findById(req.params.id);
    if (!brand)
        return next(appError.create("barnd not exist", 400, httpStatusText.FAIL));
    //check file 
    if (req.file) {
        const { secure_url, public_id } = await cloudinary.uploader.upload(brand.image.publicId);

        brand.image = { publicId: public_id, secure_url: secure_url };
    }


    brand.name = req.body.name ? req.body.name : brand.name;
    brand.slug = req.body.name ? slugify(req.body.name) : brand.slug;

    await brand.save();

    return res.json({
        success: true,
        message: "Brand update Successfully"
    });

});

export const deleteBrand = asyncWrapper(async (req, res, next) => {

    const brand = await Brand.findByIdAndDelete(req.params.id);
    if (!brand)
        return next(appError.create("barnd not exist", 400, httpStatusText.FAIL));

    //delete image
    await cloudinary.uploader.destroy(brand.image.publicId);

    await Category.updateMany(
        {},
        { $pull: { brands: brand._id } });

    return res.json({
        success: true,
        message: "Brand deleted successfully!"
    });

});

export const getBrand = asyncWrapper(async (req, res, next) => {
    //@TODO category query
    const { category, subcategory, page = 1, limit = 10 } = req.query;
    const skip = (page - 1) * 10;
    // @TODO category query
    if (category) {
        const categoryDoc = await Category.findOne({
            $or: [
                { _id: mongoose.isValidObjectId(category) ? category : null },
                { slug: category }
            ]
        });
        if (!categoryDoc) return res.json({ success: true, results: [], totalDoc: 0 });
        const totalDoc = await Brand.countDocuments({ _id: { $in: categoryDoc.brands } });
        const results = await Brand.find({ _id: { $in: categoryDoc.brands } })
            .populate("categories")
            .skip(skip)
            .limit(Number(limit));
        return res.json({
            success: true,
            totalDoc,
            totalPages: Math.ceil(totalDoc / limit),
            currentPage: Number(page),
            results
        });
    }
    // @TODO subcategory query
    if (subcategory) {
        const subcategoryDoc = await Subcategory.findOne({
            $or: [
                { _id: mongoose.isValidObjectId(subcategory) ? subcategory : null },
                { slug: subcategory }
            ]
        });

        if (!subcategoryDoc) return res.json({ success: true, results: [], totalDoc: 0 });
        const totalDoc = await Brand.countDocuments({ _id: { $in: subcategoryDoc.brands } });
        const results = await Brand.find({ _id: { $in: subcategoryDoc.brands } })
            .populate("categories")     // virtual
            .populate("subcategories")  // virtual join 
            .skip(skip)
            .limit(Number(limit));
        return res.json({
            success: true,
            totalDoc,
            totalPages: Math.ceil(totalDoc / limit),
            currentPage: Number(page),
            results
        });
    }

    // @TODO pagination
    const totalDoc = await Brand.countDocuments();
    const results = await Brand.find()
        .populate("categories")     // virtual
        .populate("subcategories")  // virtual
        .skip(skip)
        .limit(Number(limit));
    console.log(results);

    return res.json({
        success: true,
        totalDoc,
        totalPages: Math.ceil(totalDoc / limit),
        currentPage: Number(page),
        results
    });
});


