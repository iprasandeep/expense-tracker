const path = require('path');
const ForgotPassword = require('../models/Forgot');
const User = require('../models/User');
const bcrypt = require('bcrypt');

async function renderResetPassword(req, res) {
  const resetPasswordPagePath = path.join(__dirname, '..', 'views', 'resetPassword.html');
  res.sendFile(resetPasswordPagePath);
}

async function resetPassword(req, res) {
  try {
    const { requestId } = req.params;
    const { newPassword } = req.body;
    console.log('Reset password route accessed. ID:', requestId);

    const forgotPasswordRequest = await ForgotPassword.findOne({
      where: { requestId, isActive: true },
    });

    if (!forgotPasswordRequest) {
      return res.status(400).json({ message: 'Invalid or expired request' });
    }

    const user = await User.findByPk(forgotPasswordRequest.userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);
    await user.update({ password: hashedPassword });
    await forgotPasswordRequest.update({ isActive: false });

    res.json({ message: 'Password reset successful' });
  } catch (error) {
    console.error('Error resetting password:', error);
    res.status(500).json({ message: 'An error occurred' });
  }
}

module.exports = {
  renderResetPassword,
  resetPassword,
};
