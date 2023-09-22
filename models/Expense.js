import {DataTypes } from 'sequelize';
import {sequelize} from '../db/database.js';


export const Expense = sequelize.define('Expense', {
  amount: {
    type: DataTypes.FLOAT,
    allowNull: false,
    validate: {
      isFloat: true, 
      min: 0, 
    },
  },
  details: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  category: {
    type: DataTypes.STRING,
    allowNull: false,
  },
});


export default Expense;