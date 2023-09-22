import { DataTypes } from 'sequelize';
import {sequelize} from '../db/database.js';

export const User = sequelize.define('User', {
  name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  email: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
  },
  password: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  totalExpense: {
    type: DataTypes.FLOAT,
    allowNull: false,
    defaultValue: 0,
  },
  premiumUser: {
    type: DataTypes.BOOLEAN,
    allowNull: false,
    defaultValue: false,
  },
  
});

export default User;