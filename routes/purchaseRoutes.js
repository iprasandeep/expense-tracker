const express = require('express');
const router = express.Router();
const authenticateUser = require('../utils/authentication');
const premiumRoutes = require('../controllers/purchasePremiumController');


router.get('/buypremium',authenticateUser , premiumRoutes.purchasePremium);
router.post('/updatestatus',authenticateUser, premiumRoutes.updateTransaction);

module.exports = router;