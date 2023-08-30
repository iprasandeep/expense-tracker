const ForgotPassword = require('../models/Forgot');
const User = require('../models/User');
const bcrypt = require('bcrypt');

// async function renderResetPassword(req, res) {
//   const resetPasswordPagePath = path.join(__dirname, '..', 'views', 'resetPassword.html');
//   res.sendFile(resetPasswordPagePath);
// }

async function resetPassword(req, res) {
  try {
    const { requestId } = req.params;
    const { newPassword } = req.body;
    console.log("Request Id: ", requestId);
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

async function resetingLink(req, res) {
  try {
    const { requestId } = req.params;

    // Find the active reset request
    const forgotPasswordRequest = await ForgotPassword.findOne({
      where: { requestId, isActive: true },
    });

    if (!forgotPasswordRequest) {
      return res.status(400).json({ message: 'Invalid or expired request' });
    }

    // Render the inbuilt reset password page directly
    res.send(`
      <html>
      <!-- Include your CSS and HTML styling here -->
      <body>
        <form action="/update_password/${requestId}" method="post">
          <label for="newPassword">New Password:</label>
          <input type="password" name="newPassword" required>
          <button type="submit">Reset Password</button>
        </form>
      </body>
      </html>
    `);
  } catch (error) {
    console.error('Error rendering reset password page:', error);
    res.status(500).json({ message: 'An error occurred' });
  }
}

// Define the password update route
 async function resetPassword (req, res){
  try {
    const { requestId } = req.params;
    const { newPassword } = req.body;

    // Find the active reset request
    const forgotPasswordRequest = await ForgotPassword.findOne({
      where: { requestId, isActive: true },
    });

    if (!forgotPasswordRequest) {
      return res.status(400).json({ message: 'Invalid or expired request' });
    }

    // Update the user's password and deactivate the reset request
    const user = await User.findByPk(forgotPasswordRequest.userId);
    if (user) {
      const hashedPassword = await bcrypt.hash(newPassword, 10);
      await user.update({ password: hashedPassword });
      await forgotPasswordRequest.update({ isActive: false });
      return res.json({ message: 'Password reset successful' });
    } else {
      return res.status(404).json({ message: 'User not found' });
    }
  } catch (error) {
    console.error('Error updating password:', error);
    res.status(500).json({ message: 'An error occurred' });
  }
}

module.exports = {
  resetingLink,
  resetPassword,
  resetPassword
};
