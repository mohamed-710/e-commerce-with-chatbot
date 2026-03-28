// ══════════════════════════════════════════════════════════════════════════════
// subCategory.routes.js
// ══════════════════════════════════════════════════════════════════════════════
import express from "express";
import { verifyToken } from "../middlewares/verifyToken.js";
import { isAuthorized } from "../middlewares/allowedTo.js";
import { validation } from "../middlewares/validation.js";
import { uploadFileCloud } from "../middlewares/fileUpload.js";
import {
  createSubCategorySchema,
  deleteSubCategorySchema,
  UpdateSubCategorySchema,
  allSubCategoriesSchema,
} from "../validators/subCategorySchema.js";
import {
  createSubCategory,
  deleteSubCategory,
  updateSubCategory,
  allSubCategories,
} from "../controllers/subCategory.controller.js";
 
const subRoute = express.Router({ mergeParams: true });
 
/**
 * @swagger
 * tags:
 *   name: SubCategory
 *   description: Subcategory management (nested under categories)
 */
 
// ─────────────────────────────────────────────────────────────────────────────
// GET /category/:category/subcategories
// ─────────────────────────────────────────────────────────────────────────────
/**
 * @swagger
 * /category/{category}/subcategories:
 *   get:
 *     summary: Get subcategories of a category
 *     description: Returns all subcategories that belong to a specific category.
 *     tags: [SubCategory]
 *     parameters:
 *       - name: category
 *         in: path
 *         required: true
 *         description: Parent category ID
 *         schema:
 *           type: string
 *           example: "64a1b2c3d4e5f6789abcdef1"
 *       - $ref: '#/components/parameters/PageParam'
 *       - $ref: '#/components/parameters/LimitParam'
 *     responses:
 *       200:
 *         description: Subcategories retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/SubCategoryListResponse'
 *       404:
 *         description: Category not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *             example:
 *               success: false
 *               message: "Category not found"
 *       500:
 *         $ref: '#/components/responses/InternalError'
 */
subRoute.get("/", validation(allSubCategoriesSchema), allSubCategories);
 
// ─────────────────────────────────────────────────────────────────────────────
// POST /category/:category/subcategories
// ─────────────────────────────────────────────────────────────────────────────
/**
 * @swagger
 * /category/{category}/subcategories:
 *   post:
 *     summary: Create a subcategory
 *     description: Admin only. Creates a subcategory linked to the given category.
 *     tags: [SubCategory]
 *     security:
 *       - cookieAuth: []
 *     parameters:
 *       - name: category
 *         in: path
 *         required: true
 *         description: Parent category ID
 *         schema:
 *           type: string
 *           example: "64a1b2c3d4e5f6789abcdef1"
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
 *                 example: "Smartphones"
 *               subcategory:
 *                 type: string
 *                 format: binary
 *                 description: Subcategory image (jpg/png/webp)
 *     responses:
 *       201:
 *         description: Subcategory created successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/SubCategorySingleResponse'
 *       401:
 *         $ref: '#/components/responses/Unauthorized'
 *       403:
 *         $ref: '#/components/responses/Forbidden'
 *       404:
 *         description: Parent category not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       409:
 *         description: Subcategory name already exists in this category
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *             example:
 *               success: false
 *               message: "Subcategory name already exists"
 *       422:
 *         $ref: '#/components/responses/ValidationError'
 *       500:
 *         $ref: '#/components/responses/InternalError'
 */
subRoute.post(
  "/",
  verifyToken,
  isAuthorized("admin"),
  uploadFileCloud().single("subcategory"),
  validation(createSubCategorySchema),
  createSubCategory,
);
 
// ─────────────────────────────────────────────────────────────────────────────
// PATCH /category/:category/subcategories/:id
// ─────────────────────────────────────────────────────────────────────────────
/**
 * @swagger
 * /category/{category}/subcategories/{id}:
 *   patch:
 *     summary: Update a subcategory
 *     description: Admin only. Update the subcategory name or image.
 *     tags: [SubCategory]
 *     security:
 *       - cookieAuth: []
 *     parameters:
 *       - name: category
 *         in: path
 *         required: true
 *         description: Parent category ID
 *         schema:
 *           type: string
 *           example: "64a1b2c3d4e5f6789abcdef1"
 *       - $ref: '#/components/parameters/IdParam'
 *     requestBody:
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 example: "Tablets"
 *               subcategory:
 *                 type: string
 *                 format: binary
 *                 description: New image (optional)
 *     responses:
 *       200:
 *         description: Subcategory updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/SubCategorySingleResponse'
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
subRoute.patch(
  "/:id",
  verifyToken,
  isAuthorized("admin"),
  uploadFileCloud().single("subcategory"),
  validation(UpdateSubCategorySchema),
  updateSubCategory,
);
 
// ─────────────────────────────────────────────────────────────────────────────
// DELETE /category/:category/subcategories/:id
// ─────────────────────────────────────────────────────────────────────────────
/**
 * @swagger
 * /category/{category}/subcategories/{id}:
 *   delete:
 *     summary: Delete a subcategory
 *     description: Admin only. Permanently removes the subcategory and its image from Cloudinary.
 *     tags: [SubCategory]
 *     security:
 *       - cookieAuth: []
 *     parameters:
 *       - name: category
 *         in: path
 *         required: true
 *         description: Parent category ID
 *         schema:
 *           type: string
 *           example: "64a1b2c3d4e5f6789abcdef1"
 *       - $ref: '#/components/parameters/IdParam'
 *     responses:
 *       200:
 *         description: Subcategory deleted successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/SuccessMessage'
 *             example:
 *               success: true
 *               message: "Subcategory deleted successfully"
 *       401:
 *         $ref: '#/components/responses/Unauthorized'
 *       403:
 *         $ref: '#/components/responses/Forbidden'
 *       404:
 *         $ref: '#/components/responses/NotFound'
 *       500:
 *         $ref: '#/components/responses/InternalError'
 */
subRoute.delete(
  "/:id",
  verifyToken,
  isAuthorized("admin"),
  validation(deleteSubCategorySchema),
  deleteSubCategory,
);
 
export default subRoute;