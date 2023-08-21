const User = require('../models/User');

 // get premium status 
 exports.membershipStatus = async (req, res) => {
  try {
    const user = await User.findOne({ where: { id: req.user.id } });
    if (user) {
      res.json({ premiumUser: user.premiumUser });
    } else {
      res.status(404).json({ error: "User not found" });
    }
  } catch (err) {
    console.error("Error fetching user premium status:", err);
    res.status(500).json({ error: "Internal server error" });
  }
}

