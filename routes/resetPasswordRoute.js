const express = require('express');
const router = express.Router();
const resetPasswordController = require('../controllers/resetPasswordController');

router.get('/reset-password/:requestId', resetPasswordController.renderResetPassword);
router.put('/reset-password/:requestId', resetPasswordController.resetPassword);

module.exports = router;
