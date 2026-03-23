import express from "express";
import {isAuthorized} from "../middlewares/allowedTo.js";
import { verifyToken } from "../middlewares/verifyToken.js";
import { validation } from "../middlewares/validation.js";
import {uploadFileCloud} from "../middlewares/fileUpload.js";
import { createBrand ,updateBrand,deleteBrand,getBrand} from "../controllers/brand.controller.js";
import {createBrandSchema,updateBrandSchema,deleteBrandSchema} from "../validators/brandSchema.js"; 
const route=express.Router();

//cretae brand
route.post("/create-brand",
    verifyToken,
    isAuthorized("admin"),
    uploadFileCloud().single('brand'),
    validation(createBrandSchema),
    createBrand,
);
route.patch("/:id",
    verifyToken,
    isAuthorized("admin"),
    uploadFileCloud().single('brand'),
    validation(updateBrandSchema),
    updateBrand,
)
route.delete("/:id",
    verifyToken,
    isAuthorized("admin"),
    validation(deleteBrandSchema),
    deleteBrand
);
route.get("/",getBrand);
export default route;