const Expense = require('../models/Expense');

const addExpense = async (req, res) => {
  const userId = req.user.id;
  const { amount, details, category } = req.body;
  console.log("Categry:", category);

  try {
    const expense = await Expense.create({
      amount,
      details,
      category,
      UserId: userId 
    });
    return res.status(201).json({ success: true, expense });
    // console.log("Category:", expense.category);
  } catch (error) {
    return res.status(500).json({ success: false, message: 'An error occurred' });
  }
};

const getExpenses = async (req, res) => {
  const userId = req.user.id;
  try {
    const expenses = await Expense.findAll({ where: { UserId: userId } });
    return res.status(200).json(expenses);
   
  } catch (error) {
    return res.status(500).json({ success: false, message: 'An error occurred' });
  }
};

const deleteExpense = async (req, res) => {

  const userId = req.user.id;
  const { id } = req.body;
  try {
    const expense = await Expense.findOne({ where: { id, UserId: userId } });
    if (!expense) {
      return res.status(404).json({ success: false, message: 'Expense not found' });
    }
    await expense.destroy();
    return res.status(200).json({ success: true });
  } catch (error) {
    return res.status(500).json({ success: false, message: 'An error occurred' });
  }
};

module.exports = {
  addExpense,
  getExpenses,
  deleteExpense
};

