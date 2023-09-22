import { Sequelize } from 'sequelize';
import dotenv from 'dotenv';
dotenv.config();

export const sequelize = new Sequelize({
  dialect: 'mysql', // e.g., 'mysql', 'postgres', 'sqlite'
  host: process.env.DB_HOST,
  username: process.env.DB_USER, 
  password: process.env.DB_PASSWORD, 
  database: process.env.DB_NAME, 
});

export default {sequelize};