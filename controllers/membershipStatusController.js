import { User } from '../models/User.js';

//  premium status
export const membershipStatus = async (req, res) => {
  try {
    const user = await User.findByPk(req.user.id);
    if (user) {
      res.json({ premiumUser: user.premiumUser });
    } else {
      res.status(404).json({ error: 'User not found' });
    }
  } catch (err) {
    console.error('Error fetching user premium status:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
};

export default membershipStatus;