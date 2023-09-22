import express from 'express';
import {generateExpenseReport} from '../controllers/reportController.js';
import authenticateUser from '../utils/authentication.js';

const router = express.Router();

router.post('/generate-expense-report', authenticateUser, generateExpenseReport);

export default router;