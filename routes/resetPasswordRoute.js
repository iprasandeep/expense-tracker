import express from 'express';
import { resetingLink, resetPassword } from '../controllers/resetPasswordController.js';

const router = express.Router();

router.get('/reset_password/:requestId', resetingLink);
router.post('/update_password/:requestId', resetPassword);

export default router;
