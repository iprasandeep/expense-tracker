const express = require('express');
const bodyParser = require('body-parser');
const User = require('./models/User'); 
const sequelize = require('./db/database');
const Expense = require('./models/Expense');
const authenticateUser = require('./utils/authentication');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const Order = require('./models/Order');
const Razorpay = require('razorpay');
const { v4: uuidv4 } = require('uuid')

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

// paymtne db
User.hasMany(Order, { foreignKey: 'UserId', onDelete: 'CASCADE', onUpdate: 'CASCADE' });
Order.belongsTo(User, { foreignKey: 'UserId' });


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

//payment
const razorpay = new Razorpay({
  key_id: process.env.KEY_ID,
  key_secret: process.env.KEY_SECRET,
});

app.post('/buyPremium', authenticateUser, async (req, res) => {
  const userId = req.user.id;

  try {
 
    const user = await User.findByPk(userId);
    if (user.premiumUser) {
      return res.status(400).json({ message: "You're already a premium member" });
    }
    const orderId = uuidv4();

    const order = await razorpay.orders.create({
      amount: 1000, 
      currency: 'INR',
      receipt: orderId,
      payment_capture: 1 
    });
    await Order.create({
      UserId: userId,
      orderId,
      status: 'PENDING'
    });

    res.json("OK");
  } catch (error) {
    console.error('Error creating order:', error);
    res.status(500).json({ error: 'An error occurred' });
  }
});

app.post('/premium_membership', authenticateUser, async (req, res) => {
  const userId = req.user.id;
  const { paymentId } = req.body;

  try {
    let status = 'PENDING';
    if (paymentId) {
      status = 'SUCCESS';
    }
    await Order.update({ status, paymentId }, {
      where: {
        UserId: userId,
        status: 'PENDING'
      }
    });

    if (status === 'SUCCESS') {
      await User.update({ premiumUser: true }, {
        where: {
          id: userId
        }
      });
    }

    const token = jwt.sign({ id: userId, premiumUser: status === 'SUCCESS' }, secretKey);

    res.status(200).json({ message: 'Payment status updated', token });
  } catch (error) {
    console.error('Error updating premium membership:', error);
    res.status(500).json({ error: 'An error occurred' });
  }
});

app.get('/getUserPremiumStatus', authenticateUser, async (req, res) => {
  try {
    const userId = req.user.id;
    const user = await User.findByPk(userId);

    res.status(200).json({ isPremiumMember: user.premiumUser });
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ message: 'An error occurred' });
  }
});


const port = 3000;
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
