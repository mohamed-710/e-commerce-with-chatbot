import express from "express"
import { verifyToken } from "../middlewares/verifyToken.js";
import { isAuthorized } from "../middlewares/allowedTo.js";
import { validation } from "../middlewares/validation.js";
import {ValidateCreateCoupon, ValidateUpdateCoupon, ValidateDeleteCoupon} from "../validators/couponSchema.js"
import {getAllCoupons, createCoupon, updateCoupon, deleteCoupon} from "../controllers/coupon.controller.js"
const route=express.Router();

//get all coupons 
route.get("/",
    verifyToken,
    isAuthorized("admin", "seller"),
    getAllCoupons
);
//create coupon 
route.post("/create-coupon",
    verifyToken,
    isAuthorized("seller"),
    validation(ValidateCreateCoupon),
    createCoupon
);
//update coupon 
route.patch("/:code",
    verifyToken,
    isAuthorized("seller"),
    validation(ValidateUpdateCoupon),
    updateCoupon
);
//delete coupon 
route.delete("/:code",
    verifyToken,
    isAuthorized("seller"),
    validation(ValidateDeleteCoupon),
    deleteCoupon
);

export default route;