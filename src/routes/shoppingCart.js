import express from "express";

import validateToken from "../middlewares/tokenValidation.js";
import {
    getShoppingCart,
    insertProductToCart,
    removeProductInCart,
    addProductCounter,
    subtractProductCounter
} from "../controllers/shoppingCart.js";

const router = express.Router();

router.get("/", validateToken, getShoppingCart);
router.post("/", validateToken, insertProductToCart);
router.delete("/:ID", validateToken, removeProductInCart);
router.put("/:ID/add", validateToken, addProductCounter);
router.put("/:ID/subtract", validateToken, subtractProductCounter);

export default router;
