const express = require('express');
const router = express.Router();
const authenticateUser = require('../utils/authentication');
const memebrshipCheck = require('../controllers/membershipStatusController');

router.get('/memebrshipstatus',authenticateUser, memebrshipCheck.membershipStatus );

module.exports = router;