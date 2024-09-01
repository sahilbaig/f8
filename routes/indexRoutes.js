import { Router } from 'express';
import * as api from '../controllers/indexController.js';
const router = Router();

router.get('/cpu_percent', api.cpu_percent)
router.get('/get-hostname', api.getHostname)
router.get('/processor-info', api.getProcessorInfo)
router.get('/ram-info', api.getRAMInfo)
router.get('/system-info', api.getSystemInfo)
router.get('/ram_percent', api.ramPercent)
router.get('/disk_usage', api.diskUsage)
router.get('/system-time', api.systemTime)
router.get('/get-processor-info', api.getProcessorInfo)
router.get('/timezone-list', api.systemTimezone);

export default router