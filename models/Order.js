import { DataTypes, Sequelize } from 'sequelize';
import {sequelize} from '../db/database.js';

export const Order = sequelize.define('Order', {
  id:{
    type:Sequelize.INTEGER,
    allowNull:false,
    primaryKey:true,
    autoIncrement:true
},
paymentid:Sequelize.STRING,
orderid:Sequelize.STRING,
status:Sequelize.STRING
});

export default Order;
