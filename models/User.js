const { DataTypes } = require('sequelize');
const sequelize = require('../db/database');
const jwt = require('jsonwebtoken');
const Expense = require('./Expense');
// const bcrypt = require('bcryptjs');

const User = sequelize.define('User', {
  name: {
    type: DataTypes.STRING,
    allowNull: false
  },
  email: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true
  },
  password: {
    type: DataTypes.STRING,
    allowNull: false
  },
  premiumUser: {
    type: DataTypes.BOOLEAN,
    allowNull: false,
    defaultValue: false
  }
});


module.exports = User;
