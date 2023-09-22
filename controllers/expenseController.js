// import sequelize from '../db/database.js';
import Expense from '../models/Expense.js';
import User from '../models/User.js';
import { sequelize } from '../db/database.js';

export const addExpense = async (req, res) => {
  const userId = req.user.id;
  const { amount, details, category } = req.body;
  let t; 

  try {
    t = await sequelize.transaction();

    const expense = await Expense.create(
      {
        amount,
        details,
        category,
        UserId: userId,
      },
      { transaction: t }
    );

    await User.increment('totalExpense', {
      by: parseFloat(amount),
      where: { id: userId },
      transaction: t,
    });

    await t.commit();

    return res.status(201).json({ success: true, expense });
  } catch (error) {
    console.error('Error adding expense:', error);

    if (t) {
      await t.rollback();
    }

    return res.status(500).json({ success: false, message: 'An error occurred' });
  }
};

export const getExpenses = async (req, res) => {
  const userId = req.user.id;
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 5;

  try {
    const offset = (page - 1) * limit;
    const expenses = await Expense.findAll({
      where: { UserId: userId },
      offset,
      limit,
    });

    const totalCount = await Expense.count({ where: { UserId: userId } });

    return res.status(200).json({ expenses, totalCount });
  } catch (error) {
    return res.status(500).json({ success: false, message: 'An error occurred' });
  }
};

export const deleteExpense = async (req, res) => {
  const userId = req.user.id;
  const { id } = req.body;

  const t = await sequelize.transaction();

  try {
    const expense = await Expense.findOne({ where: { id, UserId: userId }, transaction: t });
    if (!expense) {
      await t.rollback();
      return res.status(404).json({ success: false, message: 'Expense not found' });
    }

    await User.decrement('totalExpense', {
      by: parseFloat(expense.amount),
      where: { id: userId },
      transaction: t,
    });

    await expense.destroy({ transaction: t });
    await t.commit();

    return res.status(200).json({ success: true });
  } catch (error) {
    console.error('Error deleting expense:', error);
    await t.rollback();
    return res.status(500).json({ success: false, message: 'An error occurred' });
  }
};

export default {
  addExpense,
  getExpenses,
  deleteExpense,
};
