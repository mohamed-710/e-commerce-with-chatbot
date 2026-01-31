import express from "express";
import { verifyToken } from "../middlewares/verifyToken.js";
import { isAuthorized } from "../middlewares/allowedTo.js";
import {validation} from '../middlewares/validation.js';
import { uploadFileCloud } from "../middlewares/fileUpload.js";
import { ValidateCategorySchema } from "../validators/categorySchema.js";
import {createCategory}  from "../controllers/category.controller.js";
const route=express.Router();

//create category 

route.post(
    '/',
    verifyToken,
    isAuthorized("admin"),
    uploadFileCloud().single('category'),
    validation(ValidateCategorySchema),
    createCategory
);

export default route;