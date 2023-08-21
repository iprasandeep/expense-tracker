const express = require('express');
const router = express.Router();
const authenticateUser = require('../utils/authentication');
const expenseController = require('../controllers/expenseController');


router.post('/addExpense', authenticateUser, expenseController.addExpense);
router.get('/expenses', authenticateUser, expenseController.getExpenses);
router.post('/deleteExpense', authenticateUser, expenseController.deleteExpense);


module.exports = router;
