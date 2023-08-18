const express = require('express');
const bodyParser = require('body-parser');
const User = require('./models/User'); 
const sequelize = require('./db/database');
const Expense = require('./models/Expense');
const authenticateUser = require('./utils/authentication');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const userRoutes = require('./routes/userRoutes');
const expenseRoutes = require('./routes/expenseRoutes');

const salt = bcrypt.genSaltSync(10);
const secretKey = 'fewfewrredsas'; 

const app = express();

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.use(express.static('views'));

Expense.belongsTo(User, { foreignKey: 'UserId', onDelete: 'SET NULL', onUpdate: 'CASCADE' });
User.hasMany(Expense, { foreignKey: 'UserId', onDelete: 'SET NULL', onUpdate: 'CASCADE' });

(async () => {
  await sequelize.sync({ force: false });
  console.log('Connected to database and synced models');
})();

User.hasMany(Expense);
Expense.belongsTo(User);

app.get('/', (req, res) => {
  res.sendFile(__dirname + '/views/login.html');
});

app.post('/signup', async (req, res) => {
  const { name, email, password } = req.body;
  
  try {
    const existingUser = await User.findOne({ where: { email } });
    if (existingUser) {
      return res.status(403).json({ success: false, message: 'User already exists' });
    }
    const hashedPassword = bcrypt.hashSync(password, salt);
    await User.create({ name, email, password: hashedPassword });
    res.status(200).json({ success: true });
  } catch (error) {
    console.error('Error creating user:', error);
    res.status(500).json({ success: false });
  }
});

app.post('/login', async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ where: { email } });

    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    const passwordMatch = bcrypt.compareSync(password, user.password);
    if (!passwordMatch) {
      return res.status(403).json({ success: false, message: 'Wrong email or password' });
    }

    const token = jwt.sign({ id: user.id }, secretKey); 
    res.status(200).json({ success: true, redirectTo: '/expense.html', token });
  } catch (error) {
    console.error('Error querying database:', error);
    res.status(500).json({ success: false });
  }
});

app.post('/addExpense', authenticateUser, async (req, res) => {
  const userId = req.user.id;
  const { amount, details, category } = req.body;

  try {
    const expense = await Expense.create({
      amount,
      details,
      category,
      UserId: userId 
    });
    return res.status(201).json({ success: true, expense });
  } catch (error) {
    return res.status(500).json({ success: false, message: 'An error occurred' });
  }
});

app.get('/expenses', authenticateUser, async (req, res) => {
  const userId = req.user.id;
  try {
    const expenses = await Expense.findAll({ where: { UserId: userId } });
    return res.status(200).json(expenses);
  } catch (error) {
    return res.status(500).json({ success: false, message: 'An error occurred' });
  }
});

app.post('/deleteExpense', authenticateUser, async (req, res) => {
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
});
// route
// app.use('/user', userRoutes);
// app.use('/expenses', expenseRoutes);

const port = 3000;
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
