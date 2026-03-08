import express from "express";
import { verifyToken } from "../middlewares/verifyToken.js";
import { isAuthorized } from "../middlewares/allowedTo.js";
import {validation} from '../middlewares/validation.js';
import { uploadFileCloud } from "../middlewares/fileUpload.js";
import { ValidateCategorySchema ,UpdateCategorySchema} from "../validators/categorySchema.js";
import {createCategory,updateCategory,deleteCategory,getAllCategories}  from "../controllers/category.controller.js";
import subCategoryRoutes from './subCategory.routes.js';
const route=express.Router();

//create category 
route.use('/:category/subcategories',subCategoryRoutes)

route.post(
    '/',
    verifyToken,
    isAuthorized("admin"),
    uploadFileCloud().single('category'),
    validation(ValidateCategorySchema),
    createCategory
);

route.patch('/:id',
    verifyToken,
    isAuthorized("admin"),
    uploadFileCloud().single('category'),
    validation(UpdateCategorySchema),
    updateCategory
);

route.delete('/:id',
    verifyToken,
    isAuthorized("admin"),
    validation(UpdateCategorySchema),
    deleteCategory
);
route.get('/',
    getAllCategories
);
export default route;