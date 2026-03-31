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

// ─────────────────────────────────────────────────────────────────────────────
// POST /product/create-product
// ─────────────────────────────────────────────────────────────────────────────
export const createProduct = asyncWrapper(async (req, res, next) => {
    const { name, description, price, discount, stock, category, subcategory, brand } = req.body;

    // 1. Verify category exists
    const categoryDoc = await Category.findById(category);
    if (!categoryDoc)
        return next(appError.create("Category not found", 404, httpStatusText.FAIL));

    // 2. Verify subcategory exists
    const subcategoryDoc = await Subcategory.findById(subcategory);
    if (!subcategoryDoc)
        return next(appError.create("Subcategory not found", 404, httpStatusText.FAIL));

    // 3. Verify brand exists
    const brandDoc = await Brand.findById(brand);
    if (!brandDoc)
        return next(appError.create("Brand not found", 404, httpStatusText.FAIL));

    // 4. Check product name uniqueness
    const nameExists = await Product.findOne({ name });
    if (nameExists)
        return next(appError.create("A product with this name already exists", 409, httpStatusText.FAIL));
    if(!req.files)
        return next(appError.create("Product images are required", 400, httpStatusText.FAIL));
    // 5. Thumbnail is required
    if (!req.files?.thumbnail?.[0])
        return next(appError.create("Product thumbnail image is required", 400, httpStatusText.FAIL));

    // 6. Generate a unique cloud folder for this product's images
    const cloudFolder = nanoid();

    // 7. Upload thumbnail to Cloudinary
    const {
        public_id: thumbPublicId,
        secure_url: thumbSecureUrl,
    } = await cloudinary.uploader.upload(req.files.thumbnail[0].path, {
        folder: `${process.env.CLOUD_FOLDER_NAME}/products/${cloudFolder}`,
    });

    // 8. Upload extra images to Cloudinary (optional)
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

    // 9. Persist the product
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
