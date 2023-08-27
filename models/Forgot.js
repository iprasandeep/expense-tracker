// models/ForgotPassword.js
const { DataTypes } = require('sequelize');
const sequelize = require('../db/database');

const ForgotPassword = sequelize.define('ForgotPassword', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
  },
  isActive: {
    type: DataTypes.BOOLEAN,
    allowNull: false,
    defaultValue: true,
  },
  createdAt: {
    type: DataTypes.DATE,
    allowNull: false,
    defaultValue: DataTypes.NOW,
  },
});

module.exports = ForgotPassword;
