import express from 'express';
const { Router } = express;
import authenticateUser from '../utils/authentication.js';
import {addExpense, getExpenses,deleteExpense} from '../controllers/expenseController.js';

const router = Router();

router.post('/addExpense', authenticateUser, addExpense);
router.get('/expenses', authenticateUser, getExpenses);
router.get('/totalCount', authenticateUser, getExpenses);
router.post('/deleteExpense', authenticateUser,deleteExpense);

export default router;