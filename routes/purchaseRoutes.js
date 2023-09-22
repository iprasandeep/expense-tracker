import express from 'express';
import authenticateUser from '../utils/authentication.js';
import {purchasePremium, updateTransaction} from '../controllers/purchasePremiumController.js';

const router = express.Router();

router.get('/buypremium', authenticateUser, purchasePremium);
router.post('/updatestatus', authenticateUser, updateTransaction);

export default router;