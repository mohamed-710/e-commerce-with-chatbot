import express from "express";
import { verifyToken } from "../middlewares/verifyToken.js";
import { isAuthorized } from "../middlewares/allowedTo.js";
import { validation } from "../middlewares/validation.js";
import { uploadFileCloud } from "../middlewares/fileUpload.js";
import { createProduct } from "../controllers/product.controller.js";
import { createProductSchema } from "../validators/productSchema.js";

const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Product
 *   description: Product management
 */

// ─────────────────────────────────────────────────────────────────────────────
// POST /product/create-product
// ─────────────────────────────────────────────────────────────────────────────
/**
 * @swagger
 * /product/create-product:
 *   post:
 *     summary: Create a new product
 *     description: Admin or seller. Upload a thumbnail (required) and one optional extra image. All IDs must reference existing documents.
 *     tags: [Product]
 *     security:
 *       - cookieAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             required: [name, description, price, stock, category, subcategory, brand, thumbnail]
 *             properties:
 *               name:
 *                 type: string
 *                 example: "Wireless Headphones"
 *               description:
 *                 type: string
 *                 example: "Premium noise-cancelling over-ear headphones"
 *               price:
 *                 type: number
 *                 example: 199.99
 *               discount:
 *                 type: number
 *                 example: 10
 *               stock:
 *                 type: integer
 *                 example: 50
 *               category:
 *                 type: string
 *                 example: "64a1b2c3d4e5f6789abcdef1"
 *               subcategory:
 *                 type: string
 *                 example: "64a1b2c3d4e5f6789abcdef2"
 *               brand:
 *                 type: string
 *                 example: "64a1b2c3d4e5f6789abcdef3"
 *               thumbnail:
 *                 type: string
 *                 format: binary
 *                 description: Main product thumbnail (required)
 *               images:
 *                 type: string
 *                 format: binary
 *                 description: Optional extra product image
 *     responses:
 *       201:
 *         description: Product created successfully
 *       400:
 *         $ref: '#/components/responses/ValidationError'
 *       401:
 *         $ref: '#/components/responses/Unauthorized'
 *       403:
 *         $ref: '#/components/responses/Forbidden'
 *       404:
 *         description: Category, subcategory, or brand not found
 *       409:
 *         description: Product name already exists
 *       500:
 *         $ref: '#/components/responses/InternalError'
 */
router.post(
    "/create-product",
    verifyToken,
    isAuthorized("admin", "seller"),
    uploadFileCloud().fields([
        { name: "thumbnail", maxCount: 1 },
        { name: "images",    maxCount: 3 },
    ]),
    validation(createProductSchema),
    createProduct,
);

export default router;
