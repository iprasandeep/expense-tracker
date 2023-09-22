import {ForgotPassword} from '../models/Forgot.js';
import {User} from '../models/User.js';
import bcrypt from 'bcrypt';

export async function resetPassword(req, res) {
  try {
    const { requestId } = req.params;
    const { newPassword } = req.body;

    console.log('Request Id:', requestId);
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

    res.send('<h1>Password Changed!</h1>');
  } catch (error) {
    console.error('Error resetting password:', error);
    res.status(500).json({ success: false });
  }
}

export async function resetingLink(req, res) {
  try {
    const { requestId } = req.params;

    const forgotPasswordRequest = await ForgotPassword.findOne({
      where: { requestId, isActive: true },
    });

    if (!forgotPasswordRequest) {
      return res.status(400).send('<h3 style="display: flex; align-items: center;">Invalid or expired request</h3>');
    }

    res.send(`
      <html>
      <!-- Include your CSS and HTML styling here -->
      <style>
        body {
          margin: 0;
          display: flex;
          justify-content: center;
          align-items: center;
          min-height: 100vh;
          background-color: #f0f0f0;
          font-family: Arial, sans-serif;
        }

        .reset-container {
          background-color: #fff;
          border-radius: 10px;
          box-shadow: 0px 0px 10px rgba(0, 0, 0, 0.1);
          padding: 20px;
          width: 100%;
          max-width: 400px;
        }

        .page-title {
          text-align: center;
          margin-bottom: 20px;
        }

        .form-details {
          margin-bottom: 20px;
        }

        .field-label {
          display: block;
          margin-bottom: 5px;
        }

        .field-input {
          width: 100%;
          padding: 10px;
          border: 1px solid #ccc;
          border-radius: 4px;
          margin-bottom: 10px;
        }

        .btn {
          background-color: #007bff;
          color: #fff;
          padding: 10px 20px;
          border: none;
          border-radius: 4px;
          cursor: pointer;
          display: flex;
          justify-content: center;
          width: 100%;
          margin: 0 auto;
        }

        .message {
          text-align: center;
          margin-bottom: 10px;
        }

        .check-user-exist {
          display: block;
          text-align: center;
          margin-bottom: 10px;
        }

        .check-user-exist a {
          color: #007bff;
          text-decoration: none;
        }
      </style>
      </head>
      <body>
        <div class="reset-container">
          <h2 class="page-title">Reset Your Password</h2>
          <form action="/update_password/${requestId}" method="post">
            <div class="form-details">
              <label class="field-label" for="newPassword">New Password:</label>
              <input class="field-input" type="password" name="newPassword" required>
            </div>
            <button class="btn" type="submit">Reset Password</button>
          </form>
          <p class="message"></p>
        </div>
      </body>
      </html>
    `);
  } catch (error) {
    console.error('Error rendering reset password page:', error);
    res.status(500).json({ message: 'An error occurred' });
  }
}

export default {
  resetPassword
}