const { Sequelize } = require('sequelize');
const { Op } = require('sequelize');
const User = require('../models/User');
const Expense = require('../models/Expense')

const getExpenseLeaderboard = async (req, res) => {
    try {
        const leaderboard = await Expense.findAll({
          attributes: [
            'UserId',
            [Sequelize.fn('SUM', Sequelize.col('amount')), 'totalExpenses'],
          ],
          group: ['UserId'],
          include: [{ model: User, attributes: ['name'] }],
          order: [[Sequelize.literal('totalExpenses'), 'DESC']],
        });
    
        res.json(leaderboard);
      } catch (error) {
        console.error('Error querying leaderboard:', error);
        res.status(500).json({ error: 'Error querying leaderboard' });
      }
};

module.exports = {
  getExpenseLeaderboard,
};