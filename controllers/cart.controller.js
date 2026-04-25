import { asyncWrapper } from "../utils/asyncHandler.js"
import Cart from '../models/Cart.js';
import appError from '../utils/appError.js';
import httpStatusText from '../utils/httpStatusText.js';
import Product from "../models/product.js";
export const addTocart = asyncWrapper(async (req, res, next) => {
    const { productId, quantity } = req.body;

    const product = await Product.findById(productId);

    if (!product) 
        return next(appError.create("product not found", 404, httpStatusText.FAIL));
   
    if(!product.inStock(quantity)) 
        return next(appError.create(`only ${product.availableStock} unit(s) available`, 400, httpStatusText.FAIL));
   
    //@TODO check if product already in cart and update quantity
    const isProductInCart = await Cart.findOne({
        user: req.user._id,
        "items.productId": productId
    });

    if(isProductInCart) {
    const theProduct=isProductInCart.items.find(
        (item)=>item.productId.toString()===productId.toString()
    )
    
    const newQuantity=theProduct.quantity+quantity;

    if(product.inStock(newQuantity)){
        theProduct.quantity=newQuantity;
        await isProductInCart.save();
        return res.json({
            success: true,
            results: isProductInCart
    });
    }else {
    const remainingToAdded = product.availableStock - theProduct.quantity;

    const errorMessage = remainingToAdded > 0 
        ? `You already have ${theProduct.quantity} in cart. Only ${remainingToAdded} unit(s) more can be added.`
        : `You already have the maximum available stock (${product.availableStock}) in your cart.`;

    return next(appError.create(errorMessage, 400, httpStatusText.FAIL));
}
}
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
        results: { cart }
    });
})

export const updateCart = (async (req, res, next) => {
    const { productId, quantity } = req.body;
    const cart = await Cart.findOneAndUpdate(
        {
            user: req.user._id,
            "items.productId": productId
        },
        { "items.$.quantity": quantity },
        { new: true }
    );
    return res.json({
        success: true,
        results: cart
    })
})

export const removeFromCart = asyncWrapper(async (req, res, next) => {
    const { productId } = req.params;

    const product = await Product.findById(productId);
    if (!product) return next(appError.create("Product not found", 404, httpStatusText.FAIL));


    //@TODO 3. Check the product is actually in the cart


    const updatedCart = await Cart.findOneAndUpdate(
        { user: req.user._id },
        { $pull: { items: { productId } } },
        { new: true }
    );

    return res.json({
        success: true,
        message: "Product removed from cart",
        results: updatedCart
    });
});

export const clearCart = asyncWrapper(async (req, res, next) => {
    const updatedCart = await Cart.findOneAndUpdate(
        { user: req.user._id },
        { $set: { items: [] } },
        { new: true }
    );

    return res.json({
        success: true,
        message: "Cart cleared successfully",
        results: updatedCart
    });
});
