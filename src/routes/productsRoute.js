import express from "express";

import validateToken from "../middlewares/tokenValidation.js";
import { getProductsList } from "../controllers/productsController.js";

const router = express();

router.get("/", validateToken, getProductsList);

export default router;
