import { Router } from 'express';
import validateToken from '../middlewares/tokenValidation.js';
import { getData, putData } from '../controllers/userConfiguration.js';
import {validateTokenConfig, confirmPassword} from "../middlewares/userConfig.js"

const router = Router();

router.get('/user-config', validateToken, getData);
router.put('/user-config', validateTokenConfig, confirmPassword, putData);

export default router; 