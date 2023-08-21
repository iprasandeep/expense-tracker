const Sequelize = require('sequelize');
const sequelize = require('../db/database');

const Order = sequelize.define('Order',{
    id:{
        type:Sequelize.INTEGER,
        allowNull:false,
        primaryKey:true,
        autoIncrement:true
    },
    paymentid:Sequelize.STRING,
    orderid:Sequelize.STRING,
    status:Sequelize.STRING
})
module.exports = Order;