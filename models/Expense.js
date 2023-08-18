const { DataTypes } = require('sequelize');
const sequelize = require('../db/database');
const User = require('./User');

const Expense = sequelize.define('Expense', {

  amount: {
    type: DataTypes.FLOAT,
    allowNull: false,
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

module.exports = Expense;
