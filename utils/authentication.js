const jwt = require('jsonwebtoken');
const User = require('../models/User');
require('dotenv').config()

const authenticateUser = async (req, res, next) => {
  try {
    const authorizationHeader = req.header('Authorization');
    if (!authorizationHeader || !authorizationHeader.startsWith('Bearer ')) {
      throw new Error('Invalid authorization header');
    }

    const token = authorizationHeader.replace('Bearer ', '');
    console.log('Token:', token);
    const decoded = jwt.verify(token, process.env.SECRET_JWT_KEY); 
    console.log('Decoded:', decoded);  
    const user = await User.findOne({ where: { id: decoded.id } });

    if (!user) {
      throw new Error('User not found');
    }
    req.user = user;
    next();
  } catch (error) {
    console.error('Authentication Error:', error);
    res.status(401).json({ success: false, message: 'Authentication failed' });
  }
};

module.exports = authenticateUser;
