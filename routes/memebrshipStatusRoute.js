import express from 'express';
import authenticateUser from '../utils/authentication.js';
import membershipStatus from '../controllers/membershipStatusController.js';

const router = express.Router();

router.get('/memebrshipstatus', authenticateUser, membershipStatus);

export default router;
