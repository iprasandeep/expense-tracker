// models/User.js
const { DataTypes } = require('sequelize');
const sequelize = require('../db/database');
const jwt = require('jsonwebtoken');
const Expense = require('./Expense');
// const bcrypt = require('bcryptjs');

const User = sequelize.define('User', {
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
});


User.prototype.generateAuthToken = function() {
  const token = jwt.sign({ id: this.id }, 'fewfewrredsas'); // Replace 'your_secret_key' with your actual secret key
  return token;
};


module.exports = User;
