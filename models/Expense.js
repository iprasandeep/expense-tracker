const { DataTypes } = require('sequelize');
const sequelize = require('../db/database');

const Expense = sequelize.define('Expense', {
    // id: {
    //     type: Sequelize.INTEGER,
    //     autoIncrement: true,
    //     allowNUll: false,
    //     primaryKey: true,
    //   },
    amount: {
      type: DataTypes.DECIMAL(10, 2),
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
