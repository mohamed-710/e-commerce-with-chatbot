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
    if (!req.files)
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

// ─────────────────────────────────────────────────────────────────────────────
// PUT /product/update-product/:id
// ─────────────────────────────────────────────────────────────────────────────
export const updateProduct = asyncWrapper(async (req, res, next) => {
    const { id } = req.params;

    // 1. Check product exists
    const product = await Product.findById(id);
    if (!product)
        return next(appError.create("Product not found", 404, httpStatusText.FAIL));

    // 2. Check ownership – seller can only update their own product
    if (
        req.user.role === "seller" &&
        product.createdBy != req.user.id
    ) {
        return next(appError.create("You are not allowed to update this product", 403, httpStatusText.FAIL));
    }

    // 3. Handle thumbnail replacement
    if (req.files?.thumbnail?.[0]) {
        const { secure_url } = await cloudinary.uploader.upload(
            req.files.thumbnail[0].path,
            { public_id: product.thumbnail.publicId }
        );
        product.thumbnail.secure_url = secure_url;
    }

    // 4. Handle extra images replacement
    if (req.files?.images?.length) {
        const uploadPromises = req.files.images.map((file, index) => {
            const publicId = product.images[index]?.publicId;
            return cloudinary.uploader.upload(file.path, { public_id: publicId });
        });
        const uploaded = await Promise.all(uploadPromises);
        product.images = uploaded.map((img) => ({
            publicId: img.public_id,
            secure_url: img.secure_url,
        }));
    }

    // 5. Update scalar fields
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
