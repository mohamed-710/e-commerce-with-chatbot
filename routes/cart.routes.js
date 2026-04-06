import express from "express";
import { addTocart,getCart } from "../controllers/cart.controller.js";
import { addToCartSchema } from "../validators/cartSchema.js";
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
    validation(addToCartSchema),
    getCart
    );

export default route;