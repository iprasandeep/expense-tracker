import dotenv from 'dotenv';
import {User} from '../models/User.js';
import {ForgotPassword} from '../models/Forgot.js';
import pkg from 'sib-api-v3-sdk';
import SibApiV3Sdk from 'sib-api-v3-sdk'; 
const { TransactionalEmailsApi } = pkg;
import { v4 as uuidv4 } from 'uuid';

dotenv.config();

const sendinblueApiInstance = new TransactionalEmailsApi();

const sendResetEmail = async (email, requestId) => {
  const client = SibApiV3Sdk.ApiClient.instance;
  const apiKey = client.authentications['api-key'];
  apiKey.apiKey = process.env.SENDINBLUE_API_KEY;

  const sender = { email: 'nestalchemy@gmail.com' };
  const receivers = [{ email }];

  const data = await sendinblueApiInstance.sendTransacEmail({
    sender,
    to: receivers,
    subject: 'Reset Your Password',
    textcontent: 'Click the link below to reset your password:',
    htmlContent: `Click the link below to reset your password: <a href="http://localhost:3001/reset_password/${requestId}">Reset Password</a>`,
  });

  console.log(data);
};

const forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;
    const user = await User.findOne({ where: { email } });

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    const requestId = uuidv4();
    const forgotPasswordRequest = await ForgotPassword.create({
      userId: user.id,
      requestId: requestId,
      isActive: true,
    });

    await sendResetEmail(email, requestId);

    res.json({ message: 'Reset link sent successfully', success: true });
  } catch (err) {
    console.error('Error sending reset link:', err);
    res.json({ message: 'An error occurred', success: false });
  }
};

export default {
  forgotPassword,
};
