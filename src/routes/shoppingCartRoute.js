import express from "express";

import validateToken from "../middlewares/tokenValidation.js";
import { validateShippingAdress } from "../middlewares/adressValidation.js";
import {
    getShoppingCart,
    insertProductToCart,
    removeProductInCart,
    addProductCounter,
    subtractProductCounter,
    confirmPurchase
} from "../controllers/shoppingCartController.js";

const router = express.Router();

router.get("/", validateToken, getShoppingCart);
router.post("/", validateToken, insertProductToCart);
router.delete("/:ID", validateToken, removeProductInCart);
router.put("/:ID/add", validateToken, addProductCounter);
router.put("/:ID/subtract", validateToken, subtractProductCounter);
router.post("/checkout", validateToken, validateShippingAdress, confirmPurchase);

export default router;
