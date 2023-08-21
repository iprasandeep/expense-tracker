const express = require('express');
const router = express.Router();
const authenticateUser = require('../utils/authentication');
const showLeaderBoard = require('../controllers/showLeaderboardController');

router.get('/showleaderboard',authenticateUser, showLeaderBoard.getExpenseLeaderboard);

module.exports = router;