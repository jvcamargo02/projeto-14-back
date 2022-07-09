import { Router } from 'express';
import { signUp, login } from '../controllers/authController.js';
import { signUpValidate, loginValidate } from '../middlewares/authValidate.js';

const router = Router();

router.post('/sign-up', signUpValidate, signUp);
router.post('/login', loginValidate, login);

export default router;
