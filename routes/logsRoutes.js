import { Router } from 'express';
import * as logs from '../controllers/logsController.js';
const router = Router();

router.get('/', logs.getLogs);
router.route('/filter')
    .get(logs.getFilteredLogs)
    .post(logs.getFilteredLogs);

export default router;