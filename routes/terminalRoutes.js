import { Router } from 'express';
const router = Router();
import { terminal } from '../controllers/terminalController.js';

router.get('/', terminal);

export default router;
