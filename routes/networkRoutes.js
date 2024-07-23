import { Router } from 'express';
import * as network from '../controllers/networkController.js';
const router = Router();

router.get('/incoming', network.incoming);
router.get('/outgoing', network.outgoing);
export default router;