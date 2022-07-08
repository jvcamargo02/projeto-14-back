import { Router } from "express"
import { signUp } from "../controllers/authController.js"
import { authValidate } from "../middlewares/authValidate.js"
/* import { validateUser } from "../middlewares/validateUser.js" */

const router = Router()

/* router.post("/", validateUser, loginUser) */
router.post("/sign-up", authValidate, signUp)

export default router