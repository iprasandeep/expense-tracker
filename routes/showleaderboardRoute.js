import express from 'express';
import authenticateUser from '../utils/authentication.js';
import {getExpenseLeaderboard}  from '../controllers/showLeaderboardController.js';

const router = express.Router();

router.get('/showleaderboard', authenticateUser, getExpenseLeaderboard);

export default router;
