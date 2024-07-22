import { Router } from 'express';
const router = Router();
import { login, logout } from '../controllers/authController.js';

router.post('/login', login);

export default router;
