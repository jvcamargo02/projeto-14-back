import { Router } from 'express';
import { signUp, login } from '../controllers/authController.js';
import { signUpValidate, loginValidate } from '../middlewares/authValidate.js';
import validateToken from '../middlewares/tokenValidation.js';
import { getData } from '../controllers/userConfiguration.js'; 

const router = Router();

router.get('/user-config', validateToken, getData);

export default router; 