require('dotenv').config();
const User = require('../models/User');
const ForgotPassword = require('../models/Forgot');
const SibApiV3Sdk = require('sib-api-v3-sdk');
const { v4: uuidv4 } = require('uuid');

const sendinblueApiInstance = new SibApiV3Sdk.TransactionalEmailsApi();

async function sendResetEmail(email, requestId) {
    // Send reset email logic here
    const client=SibApiV3Sdk.ApiClient.instance
    const apiKey=client.authentications['api-key']
    apiKey.apiKey= process.env.SENDINBLUE_API_KEY
        
    const transEmailApi=new SibApiV3Sdk.TransactionalEmailsApi();
    const sender = { email: 'nestalchemy@gmail.com' };
    const receivers = [{ email }];
  
    const data = await transEmailApi.sendTransacEmail({
      sender,
      to: receivers,
      subject: 'Reset Your Password',
      textcontent: 'Click the link below to reset your password:',
      htmlContent: `Click the link below to reset your password: <a href="http://localhost:3022/reset_password/${requestId}">Reset Password</a>`,
    });
  
    console.log(data);
  }
  async function forgotPassword(req, res) {
    try {
      const { email } = req.body;
      const user = await User.findOne({ where: { email } });
  
      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }
  
      const requestId = uuidv4(); // Use UUID for the request
      const forgotPasswordRequest = await ForgotPassword.create({
        userId: user.id, // Associate the user with the ForgotPassword entry
        requestId: requestId,
        isActive: true,
      });
  
      await sendResetEmail(email, requestId);
  
      res.json({ message: 'Reset link sent successfully', success: true });
    } catch (err) {
      console.error('Error sending reset link:', err);
      res.json({ message: 'An error occurred', success: false });
    }
  }
  
  module.exports = {
    forgotPassword,
  };
