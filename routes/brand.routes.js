import express from "express";
import {isAuthorized} from "../middlewares/allowedTo.js";
import { verifyToken } from "../middlewares/verifyToken.js";
import { validation } from "../middlewares/validation.js";
import {uploadFileCloud} from "../middlewares/fileUpload.js";
import { createBrand } from "../controllers/brand.controller.js";
import {createBrandSchema} from "../validators/brandSchema.js"; 
const route=express.Router();

//cretae brand
route.post("/create-brand",
    verifyToken,
    isAuthorized("admin"),
    uploadFileCloud().single('brand'),
    validation(createBrandSchema),
    createBrand,
);

export default route;