import { asyncWrapper } from "../utils/asyncHandler.js"
import Cart from '../models/Cart.js';
import appError from '../utils/appError.js';
import httpStatusText from '../utils/httpStatusText.js';
import Product from "../models/product.js";
export const addTocart = asyncWrapper(async (req, res, next) => {
    const {productId,quantity}=req.body;
    const product=await Product.findById(productId);
    if(!product) return next(appError.create("product not found", 404, httpStatusText.FAIL));

    if(product.availableStock<quantity) return next(appError.create("out of stock", 400, httpStatusText.FAIL));
    const cart = await Cart.findOneAndUpdate(
        {
            user: req.user._id,
        },
        {
            $push:
            {
                items:
                {
                    productId,
                    quantity
                }
            }
        },
        { new: true }
    );
    return res.json({
        success: true,
        results: cart
    });
});

//make cart conteroller get 
export const getCart = asyncWrapper(async (req, res, next) => {
    if (req.user.role === 'user') {
        const cart = await Cart.findOne({ user: req.user._id });
        return res.json({
            success: true,
            results: cart
        });
    };
    if (req.user.role === 'admin' && !req.body.cartId) return next(appError.create("cartId is required for admin", 400, httpStatusText.FAIL));
        const cart = await Cart.findById(req.body.cartId);
        if (!cart) return next(appError.create("cart not found", 404, httpStatusText.FAIL));
        return res.json({
            success: true,
            results: {cart}
        });
}) 

export const updateCart=(async(req,res,next)=>{
    const {productId,quantity}=req.body;
    const cart=await Cart.findOneAndUpdate(
        {
            user:req.user._id,
            "items.productId":productId        
        },
        {"products.$.quantity":quantity},
        {new:true}
    );
    return res.json({
        success:true,
        results:cart
    })
})