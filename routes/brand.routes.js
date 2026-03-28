import express from "express";
import { isAuthorized } from "../middlewares/allowedTo.js";
import { verifyToken } from "../middlewares/verifyToken.js";
import { validation } from "../middlewares/validation.js";
import { uploadFileCloud } from "../middlewares/fileUpload.js";
import { createBrand, updateBrand, deleteBrand, getBrand } from "../controllers/brand.controller.js";
import { createBrandSchema, updateBrandSchema, deleteBrandSchema } from "../validators/brandSchema.js";

const route = express.Router();

/**
 * @swagger
 * tags:
 *   name: Brand
 *   description: Brand management
 */

// ─────────────────────────────────────────────────────────────────────────────
// GET /brand
// ─────────────────────────────────────────────────────────────────────────────
/**
 * @swagger
 * /brand:
 *   get:
 *     summary: Get all brands
 *     description: Returns a paginated list of brands. Supports filtering by category or subcategory.
 *     tags: [Brand]
 *     parameters:
 *       - $ref: '#/components/parameters/PageParam'
 *       - $ref: '#/components/parameters/LimitParam'
 *       - name: category
 *         in: query
 *         description: Filter brands by category ID
 *         schema:
 *           type: string
 *           example: "64a1b2c3d4e5f6789abcdef1"
 *       - name: subcategory
 *         in: query
 *         description: Filter brands by subcategory ID
 *         schema:
 *           type: string
 *           example: "64a1b2c3d4e5f6789abcdef2"
 *       - name: name
 *         in: query
 *         description: Search brands by name
 *         schema:
 *           type: string
 *           example: "Nike"
 *     responses:
 *       200:
 *         description: Brands retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/BrandListResponse'
 *       500:
 *         $ref: '#/components/responses/InternalError'
 */
route.get("/", getBrand);

// ─────────────────────────────────────────────────────────────────────────────
// POST /brand/create-brand
// ─────────────────────────────────────────────────────────────────────────────
/**
 * @swagger
 * /brand/create-brand:
 *   post:
 *     summary: Create a new brand
 *     description: Admin only. Upload a brand image and provide a name and associated category IDs.
 *     tags: [Brand]
 *     security:
 *       - cookieAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             required: [name, categories, brand]
 *             properties:
 *               name:
 *                 type: string
 *                 example: "Nike"
 *               categories:
 *                 type: array
 *                 items:
 *                   type: string
 *                 example: ["64a1b2c3d4e5f6789abcdef1"]
 *                 description: Array of category IDs
 *               brand:
 *                 type: string
 *                 format: binary
 *                 description: Brand logo image (jpg/png/webp)
 *     responses:
 *       201:
 *         description: Brand created successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/BrandSingleResponse'
 *       401:
 *         $ref: '#/components/responses/Unauthorized'
 *       403:
 *         $ref: '#/components/responses/Forbidden'
 *       409:
 *         description: Brand name already exists
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *             example:
 *               success: false
 *               message: "Brand name already exists"
 *       422:
 *         $ref: '#/components/responses/ValidationError'
 *       500:
 *         $ref: '#/components/responses/InternalError'
 */
route.post(
  "/create-brand",
  verifyToken,
  isAuthorized("admin"),
  uploadFileCloud().single("brand"),
  validation(createBrandSchema),
  createBrand,
);

// ─────────────────────────────────────────────────────────────────────────────
// PATCH /brand/:id
// ─────────────────────────────────────────────────────────────────────────────
/**
 * @swagger
 * /brand/{id}:
 *   patch:
 *     summary: Update a brand
 *     description: Admin only. Update brand name, categories, or image. All fields are optional.
 *     tags: [Brand]
 *     security:
 *       - cookieAuth: []
 *     parameters:
 *       - $ref: '#/components/parameters/IdParam'
 *     requestBody:
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 example: "Adidas"
 *               categories:
 *                 type: array
 *                 items:
 *                   type: string
 *                 example: ["64a1b2c3d4e5f6789abcdef1"]
 *               brand:
 *                 type: string
 *                 format: binary
 *                 description: New brand logo (optional)
 *     responses:
 *       200:
 *         description: Brand updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/BrandSingleResponse'
 *       401:
 *         $ref: '#/components/responses/Unauthorized'
 *       403:
 *         $ref: '#/components/responses/Forbidden'
 *       404:
 *         $ref: '#/components/responses/NotFound'
 *       422:
 *         $ref: '#/components/responses/ValidationError'
 *       500:
 *         $ref: '#/components/responses/InternalError'
 */
route.patch(
  "/:id",
  verifyToken,
  isAuthorized("admin"),
  uploadFileCloud().single("brand"),
  validation(updateBrandSchema),
  updateBrand,
);

// ─────────────────────────────────────────────────────────────────────────────
// DELETE /brand/:id
// ─────────────────────────────────────────────────────────────────────────────
/**
 * @swagger
 * /brand/{id}:
 *   delete:
 *     summary: Delete a brand
 *     description: Admin only. Permanently removes the brand and its image from Cloudinary.
 *     tags: [Brand]
 *     security:
 *       - cookieAuth: []
 *     parameters:
 *       - $ref: '#/components/parameters/IdParam'
 *     responses:
 *       200:
 *         description: Brand deleted successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/SuccessMessage'
 *             example:
 *               success: true
 *               message: "Brand deleted successfully"
 *       401:
 *         $ref: '#/components/responses/Unauthorized'
 *       403:
 *         $ref: '#/components/responses/Forbidden'
 *       404:
 *         $ref: '#/components/responses/NotFound'
 *       500:
 *         $ref: '#/components/responses/InternalError'
 */
route.delete("/:id", verifyToken, isAuthorized("admin"), validation(deleteBrandSchema), deleteBrand);

export default route;