
import { mettalicDashboard } from '../controllers/metallicController.js';
import { Router } from 'express';
const router = Router();
router.get('/dashboard', mettalicDashboard);

export default router;