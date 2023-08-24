const express = require('express');
const router = express.Router();
const passwordController = require('../controllers/forgotPasswordController');
const authenticateUser = require('../utils/authentication');

// POST /password/forgotpassword
router.post('/forgotpassword', passwordController.forgotPassword);

module.exports = router;
