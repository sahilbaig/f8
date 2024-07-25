import { Router } from 'express';
import { listUpdates, updateAll } from '../controllers/updatesController.js';

const router = Router();

// Route to list updates
router.get('/', listUpdates);

// Route to update all packages
router.get('/update-all', updateAll);

export default router;
