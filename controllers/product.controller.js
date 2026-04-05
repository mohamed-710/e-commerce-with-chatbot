import { asyncWrapper } from "../utils/asyncHandler.js";
import appError from "../utils/appError.js";
import httpStatusText from "../utils/httpStatusText.js";
import cloudinary from "../config/cloud.js";
import slugify from "slugify";
import { nanoid } from "nanoid";
import Product from "../models/product.js";
import Category from "../models/Category.js";
import Subcategory from "../models/SubCategory.js";
import Brand from "../models/brand.js";


export const createProduct = asyncWrapper(async (req, res, next) => {
    const { name, description, price, discount, stock, category, subcategory, brand } = req.body;

    const categoryDoc = await Category.findById(category);
    if (!categoryDoc)
        return next(appError.create("Category not found", 404, httpStatusText.FAIL));

    const subcategoryDoc = await Subcategory.findById(subcategory);
    if (!subcategoryDoc)
        return next(appError.create("Subcategory not found", 404, httpStatusText.FAIL));

    const brandDoc = await Brand.findById(brand);
    if (!brandDoc)
        return next(appError.create("Brand not found", 404, httpStatusText.FAIL));

    const nameExists = await Product.findOne({ name });
    if (nameExists)
        return next(appError.create("A product with this name already exists", 409, httpStatusText.FAIL));
    if (!req.files)
        return next(appError.create("Product images are required", 400, httpStatusText.FAIL));

    if (!req.files?.thumbnail?.[0])
        return next(appError.create("Product thumbnail image is required", 400, httpStatusText.FAIL));

    const cloudFolder = nanoid();

    const {
        public_id: thumbPublicId,
        secure_url: thumbSecureUrl,
    } = await cloudinary.uploader.upload(req.files.thumbnail[0].path, {
        folder: `${process.env.CLOUD_FOLDER_NAME}/products/${cloudFolder}`,
    });

    let imagesData = [];
    if (req.files?.images?.length) {
        const uploadPromises = req.files.images.map((file) =>
            cloudinary.uploader.upload(file.path, {
                folder: `${process.env.CLOUD_FOLDER_NAME}/products/${cloudFolder}`,
            })
        );
        const uploadedImages = await Promise.all(uploadPromises);
        imagesData = uploadedImages.map(({ public_id, secure_url }) => ({
            publicId: public_id,
            secure_url,
        }));
    }

    const product = await Product.create({
        name,
        slug: slugify(name, { lower: true }),
        description,
        price,
        discount: discount ?? 0,
        stock,
        thumbnail: { publicId: thumbPublicId, secure_url: thumbSecureUrl },
        images: imagesData,
        cloudFolder,
        category,
        subcategory,
        brand,
        createdBy: req.user._id,
    });

    return res.status(201).json({
        success: true,
        message: "Product created successfully",
    });
});

export const updateProduct = asyncWrapper(async (req, res, next) => {
    const { id } = req.params;

    const product = await Product.findById(id);
    if (!product)
        return next(appError.create("Product not found", 404, httpStatusText.FAIL));

    if (req.user.role === "seller" && product.createdBy != req.user.id)
        return next(appError.create("You are not allowed to update this product", 403, httpStatusText.FAIL));

    if (req.files?.thumbnail?.[0]) {
        const { secure_url } = await cloudinary.uploader.upload(
            req.files.thumbnail[0].path,
            { public_id: product.thumbnail.publicId }
        );
        product.thumbnail.secure_url = secure_url;
    }
    // @TODO: Implement advanced image management:
    // - Drag & drop to reorder images
    // - Set any image as product thumbnail
    // - Edit or replace individual images without affecting others
    // if (req.files?.images?.length) {
    //     const uploadPromises = req.files.images.map((file, index) => {
    //         const publicId = product.images[index]?.publicId;
    //         return cloudinary.uploader.upload(file.path, { public_id: publicId });
    //     });
    //     const uploaded = await Promise.all(uploadPromises);
    //     product.images = uploaded.map((img) => ({
    //         publicId: img.public_id,
    //         secure_url: img.secure_url,
    //     }));
    // }

    product.name = req.body.name ? req.body.name : product.name;
    product.description = req.body.description ? req.body.description : product.description;
    product.price = req.body.price !== undefined ? req.body.price : product.price;
    product.discount = req.body.discount !== undefined ? req.body.discount : product.discount;
    product.stock = req.body.stock !== undefined ? req.body.stock : product.stock;
    if (req.body.name) {
        product.slug = slugify(req.body.name);
    }
    await product.save();

    return res.status(200).json({
        success: true,
        message: "Product updated successfully",
        data: { product },
    });
});


export const deleteProduct = asyncWrapper(async (req, res, next) => {
    const { id } = req.params;


    const product = await Product.findById(id);

    if (!product)
        return next(appError.create("Product not found", 404, httpStatusText.FAIL));

    const ids = product.images.map((image) => image.publicId);
    ids.push(product.thumbnail.publicId);

    await product.deleteOne();

    await cloudinary.api.delete_resources(ids);

    await cloudinary.api.delete_folder(`${process.env.CLOUD_FOLDER_NAME}/products/${product.cloudFolder}`);

    return res.status(200).json({ success: true, message: "Product deleted successfully" });
});

export const getProduct=asyncWrapper(async(req,res,next)=>{
    const {sort,page,keyword,category,subcategory,brand}=req.query;

    if(category&& !(await Category.findById(category)))
        return next(appError.create("Category not found",404,httpStatusText.FAIL));

    if(subcategory&& !(await Subcategory.findById(subcategory)))
        return next(appError.create("Subcategory not found",404,httpStatusText.FAIL));

    if(brand&& !(await Brand.findById(brand)))
        return next(appError.create("Brand not found",404,httpStatusText.FAIL));

    const results=await Product.find({...req.query})
    .sort(sort)
    .paginate(page)
    .search(keyword); 
 console.log(results);
 
    return res.status(200).json({
        success:true,
        message:"Product fetched successfully",
        data:results,
    });
})