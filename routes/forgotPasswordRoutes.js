import express from 'express';
import forgotPasswordController from '../controllers/forgotPasswordController.js';

const router = express.Router();

router.post('/forgotpassword', forgotPasswordController.forgotPassword);

export default router;