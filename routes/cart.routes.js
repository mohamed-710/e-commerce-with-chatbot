import express from "express";
import { addToCart } from "../controllers/cart.controller.js";
import { addToCartSchema } from "../validators/cartSchema.js";
import { validation } from "../middlewares/validation.js";


const route = express.Router();

route.post("/add-cart",ver, validation(addToCartSchema), addToCart);

export default route;