import { Router } from 'express';
const router = Router();
import { getSettings } from '../controllers/settingsController.js';

router.get('/settings', getSettings);

export default router;
