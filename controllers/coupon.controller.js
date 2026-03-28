import { asyncWrapper } from "../utils/asyncHandler.js";
import appError from "../utils/appError.js";
import httpStatusText from "../utils/httpStatusText.js";
import Coupon from "../models/coupon.js";
import { generateCouponCode } from "../utils/generateCoupon.js";

export const getAllCoupons = asyncWrapper(async (req, res, next) => {

    // admin can retrieve all coupons
    if (req.user.role === "admin") {
        const coupons = await Coupon.find();
        return res.json({ success: true, results: coupons });
    }
    // seller can retrieve only his own coupons

    const coupons = await Coupon.find({ createBy: req.user._id });
    return res.json({ success: true, results: coupons });
});

export const createCoupon = asyncWrapper(async (req, res, next) => {
    //generate coupon 
    const code = generateCouponCode();
    // save in db
    const coupon = await Coupon.create({
        name: code,
        createBy: req.user._id,
        discount: req.body.discount,
        expiredAt: new Date(req.body.expiredAt),
    })
    //response  
    return res.status(201).json({ success: true, results: coupon })
});
export const updateCoupon = asyncWrapper(async (req, res, next) => {

    //check coupon 
    const coupon = await Coupon.findOne({
        name: req.params.code,
        expiredAt: { $gt: new Date() }
    });

    if (!coupon) {
        return next(appError.create("Invalid coupon", 400, httpStatusText.FAIL));
    }
    //check owner 
    if (req.user.id != coupon.createBy)
        return next(appError.create("You are not authorized to update this coupon", 403, httpStatusText.FAIL));

    coupon.discount = req.body.discount ? req.body.discount : coupon.discount;
    coupon.expiredAt = req.body.expiredAt ? new Date(req.body.expiredAt) : coupon.expiredAt;

    return res.json({ success: true, message: "coupon update successfuly" })
});

export const deleteCoupon = asyncWrapper(async (req, res, next) => {
    // check coupon exist
    const coupon = await Coupon.findOne({ name: req.params.code });

    if (!coupon) {
        return next(appError.create("Coupon not found", 404, httpStatusText.FAIL));
    }

    // check owner
    if (req.user.id != coupon.createBy) {
        return next(appError.create("You are not authorized to delete this coupon", 403, httpStatusText.FAIL));
    }

    // finally delete it and send response
    await coupon.deleteOne();

    return res.json({ success: true, message: "Coupon deleted successfully" });
});
