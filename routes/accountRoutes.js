import { Router } from 'express';
const router = Router();
import * as accounts from '../controllers/accountController.js';

router.get('/get-accounts', accounts.getAccounts);
router.post('/add-user', accounts.addUser);
router.post('/delete-user', accounts.deleteUser);
router.post('/change-password', accounts.changePassword);  //look into this . script missing
router.post('/edit-admin-status', accounts.editAdminStatus);

export default router;
