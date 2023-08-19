const { DataTypes } = require('sequelize');
const sequelize = require('../db/database');
// const User = require('./User');

const Order = sequelize.define('Order', {
  orderId: {
    type: DataTypes.STRING,
    allowNull: false
  },
  paymentId: {
    type: DataTypes.STRING,
    allowNull: true
  },
  status: {
    type: DataTypes.ENUM('PENDING', 'SUCCESS', 'FAILURE'),
    allowNull: false,
    defaultValue: 'PENDING'
  }
});

// Order.belongsTo(User); // Define the relationship between User and Order

module.exports = Order;
