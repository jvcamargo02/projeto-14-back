import express from "express";

import validateToken from "../middlewares/tokenValidation.js";
import {
    addProductToCart,
    removeProductInCart
} from "../controllers/shoppingCart.js";

const router = express.Router();

router.post("/:ID/add", validateToken, addProductToCart);
router.delete("/:ID/remove", validateToken, removeProductInCart);
router.put("/:ID/");

export default router;
