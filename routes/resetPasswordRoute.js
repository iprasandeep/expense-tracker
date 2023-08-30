const express = require('express');
const router = express.Router();
const resetPasswordController = require('../controllers/resetPasswordController');

router.get('/reset_password/:requestId', resetPasswordController.resetingLink);
router.post('/update_password/:requestId', resetPasswordController.resetPassword)
module.exports = router;
