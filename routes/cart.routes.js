import express from "express";
import { addTocart, getCart, updateCart, removeFromCart, clearCart } from "../controllers/cart.controller.js";
import { addToCartSchema, getCartSchema, updateSchema, removeFromCartSchema } from "../validators/cartSchema.js";
import { validation } from "../middlewares/validation.js";
import { verifyToken } from "../middlewares/verifyToken.js";
import { isAuthorized } from "../middlewares/allowedTo.js";

const route = express.Router();

route.post("/add-cart",
    verifyToken
    ,isAuthorized('user'),
    validation(addToCartSchema),
    addTocart
    );
// make get cart Api user , admin 
route.get("/get-cart",
    verifyToken,
    isAuthorized('user','admin'),
    validation(getCartSchema),
    getCart
    );

route.patch("/update-cart",
    verifyToken,
    isAuthorized('user'),
    validation(updateSchema),
    updateCart
    );

route.patch("/remove-cart/:productId",
    verifyToken,
    isAuthorized('user'),
    validation(removeFromCartSchema),
    removeFromCart
    );

route.patch("/clear-cart",
    verifyToken,
    isAuthorized('user'),
    clearCart
    );

export default route;