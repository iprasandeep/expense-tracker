const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
require('dotenv').config()

const salt = bcrypt.genSaltSync(10);
const secretKey = process.env.SECRET_JWT_KEY; // token secret key

const signup = async (req, res) => {

    const { name, email, password } = req.body;
    
    try {
      const existingUser = await User.findOne({ where: { email } });
      if (existingUser) {
        return res.json({ success: false, message: 'User already exists' });
      }
      const hashedPassword = bcrypt.hashSync(password, salt);
      await User.create({ name, email, password: hashedPassword });
      res.json({ success: true });
    } catch (error) {
      console.error('Error creating user:', error);
      res.json({ success: false });
    }
};

const login = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ where: { email } });

    if (!user) {
      return res.json({ success: false, message: 'User not found' });
    }

    const passwordMatch = bcrypt.compareSync(password, user.password);
    if (!passwordMatch) {
      return res.json({ success: false, message: 'Wrong email or password' });
    }

    const token = jwt.sign({ id: user.id }, secretKey); 
    res.json({ success: true, redirectTo: '/expenses', token });
  } catch (error) {
    console.error('Error querying database:', error);
    res.json({ success: false });
  }
};

module.exports = {
  login,
  signup
};



