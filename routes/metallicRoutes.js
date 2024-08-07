
import { mettalicDashboard, metallicLogs, metallicServices } from '../controllers/metallicController.js';
import { Router } from 'express';
const router = Router();
router.get('/dashboard', mettalicDashboard);
router.get('/logs', metallicLogs)
router.post('/logs', metallicLogs)
router.get('/services', metallicServices)

export default router;