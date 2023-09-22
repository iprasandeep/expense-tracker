import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import {User} from '../models/User.js';
import dotenv from 'dotenv';

dotenv.config();

const saltRounds = 10;
const secretKey = process.env.SECRET_JWT_KEY;

export const signup = async (req, res) => {
  const { name, email, password } = req.body;

  try {
    const existingUser = await User.findOne({ where: { email } });
    if (existingUser) {
      return res.json({ success: false, message: 'User already exists' });
    }
    const hashedPassword = bcrypt.hashSync(password, saltRounds);
    await User.create({ name, email, password: hashedPassword });
    res.json({ success: true });
  } catch (error) {
    console.error('Error creating user:', error);
    res.json({ success: false });
  }
};

export const login = async (req, res) => {
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
