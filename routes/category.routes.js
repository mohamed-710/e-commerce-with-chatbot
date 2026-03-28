// ══════════════════════════════════════════════════════════════════════════════
// category.routes.js
// ══════════════════════════════════════════════════════════════════════════════
import express from "express";
import { verifyToken } from "../middlewares/verifyToken.js";
import { isAuthorized } from "../middlewares/allowedTo.js";
import { validation } from "../middlewares/validation.js";
import { uploadFileCloud } from "../middlewares/fileUpload.js";
import { ValidateCategorySchema, UpdateCategorySchema } from "../validators/categorySchema.js";
import { createCategory, updateCategory, deleteCategory, getAllCategories } from "../controllers/category.controller.js";
import subCategoryRoutes from "./subCategory.routes.js";
 
const route = express.Router();
 
/**
 * @swagger
 * tags:
 *   name: Category
 *   description: Category management
 */
 
// ─────────────────────────────────────────────────────────────────────────────
// GET /category
// ─────────────────────────────────────────────────────────────────────────────
/**
 * @swagger
 * /category:
 *   get:
 *     summary: Get all categories
 *     description: Returns a list of all available categories.
 *     tags: [Category]
 *     responses:
 *       200:
 *         description: Categories retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/CategoryListResponse'
 *       500:
 *         $ref: '#/components/responses/InternalError'
 */
route.get("/", getAllCategories);
 
// ─────────────────────────────────────────────────────────────────────────────
// POST /category
// ─────────────────────────────────────────────────────────────────────────────
/**
 * @swagger
 * /category:
 *   post:
 *     summary: Create a category
 *     description: Admin only. Creates a new category with an optional image.
 *     tags: [Category]
 *     security:
 *       - cookieAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             required: [name]
 *             properties:
 *               name:
 *                 type: string
 *                 example: "Electronics"
 *               category:
 *                 type: string
 *                 format: binary
 *                 description: Category image (jpg/png/webp)
 *     responses:
 *       201:
 *         description: Category created successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/CategorySingleResponse'
 *       401:
 *         $ref: '#/components/responses/Unauthorized'
 *       403:
 *         $ref: '#/components/responses/Forbidden'
 *       409:
 *         description: Category name already exists
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *             example:
 *               success: false
 *               message: "Category name already exists"
 *       422:
 *         $ref: '#/components/responses/ValidationError'
 *       500:
 *         $ref: '#/components/responses/InternalError'
 */
route.post(
  "/",
  verifyToken,
  isAuthorized("admin"),
  uploadFileCloud().single("category"),
  validation(ValidateCategorySchema),
  createCategory,
);
 
// ─────────────────────────────────────────────────────────────────────────────
// PATCH /category/:id
// ─────────────────────────────────────────────────────────────────────────────
/**
 * @swagger
 * /category/{id}:
 *   patch:
 *     summary: Update a category
 *     description: Admin only. Update category name or image. All fields are optional.
 *     tags: [Category]
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
 *                 example: "Updated Electronics"
 *               category:
 *                 type: string
 *                 format: binary
 *                 description: New category image (optional)
 *     responses:
 *       200:
 *         description: Category updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/CategorySingleResponse'
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
  uploadFileCloud().single("category"),
  validation(UpdateCategorySchema),
  updateCategory,
);
 
// ─────────────────────────────────────────────────────────────────────────────
// DELETE /category/:id
// ─────────────────────────────────────────────────────────────────────────────
/**
 * @swagger
 * /category/{id}:
 *   delete:
 *     summary: Delete a category
 *     description: |
 *       Admin only. Deletes the category and its image from Cloudinary.
 *       **Warning:** this will also orphan all subcategories linked to this category.
 *     tags: [Category]
 *     security:
 *       - cookieAuth: []
 *     parameters:
 *       - $ref: '#/components/parameters/IdParam'
 *     responses:
 *       200:
 *         description: Category deleted successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/SuccessMessage'
 *             example:
 *               success: true
 *               message: "Category deleted successfully"
 *       401:
 *         $ref: '#/components/responses/Unauthorized'
 *       403:
 *         $ref: '#/components/responses/Forbidden'
 *       404:
 *         $ref: '#/components/responses/NotFound'
 *       500:
 *         $ref: '#/components/responses/InternalError'
 */
route.delete("/:id", verifyToken, isAuthorized("admin"), validation(UpdateCategorySchema), deleteCategory);
 
// Nested subcategory routes
route.use("/:category/subcategories", subCategoryRoutes);
 
export default route;