import express from 'express';
import { serviceData, serviceList } from '../controllers/serviceController.js'

const router = express.Router();

router.get('/service-data', serviceData);
router.get('/service-list', serviceList);

export default router;