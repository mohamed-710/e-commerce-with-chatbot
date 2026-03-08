import express from "express";
import { verifyToken } from "../middlewares/verifyToken.js";
import { isAuthorized } from "../middlewares/allowedTo.js";
import {validation} from '../middlewares/validation.js';
import { uploadFileCloud } from "../middlewares/fileUpload.js";
import { createSubCategorySchema,deleteSubCategorySchema,UpdateSubCategorySchema,allSubCategoriesSchema } from "../validators/subCategorySchema.js";
import { createSubCategory,deleteSubCategory,updateSubCategory,allSubCategories} from "../controllers/subCategory.controller.js";
const route=express.Router({mergeParams:true});

// route.post("/",)
route.post(
    '/',
    verifyToken,
    isAuthorized("admin"),
    uploadFileCloud().single('subcategory'),
    validation(createSubCategorySchema),
    createSubCategory
);
route.delete('/:id',
    verifyToken,
    isAuthorized("admin"),
    validation(deleteSubCategorySchema),
    deleteSubCategory
);

route.patch('/:id',
    verifyToken,
    isAuthorized("admin"),
    uploadFileCloud().single('subcategory'),
    validation(UpdateSubCategorySchema),
    updateSubCategory
);
route.get('/',validation(allSubCategoriesSchema),
    allSubCategories
);
export default route;