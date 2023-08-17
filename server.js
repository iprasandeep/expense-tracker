const express = require('express');
const bodyParser = require('body-parser');
const User = require('./models/User'); 
const sequelize = require('./db/database');
const Expense = require('./models/Expense');
const bcrypt = require('bcryptjs');

const salt = bcrypt.genSaltSync(10);

const app = express();

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.use(express.static('public'));

// sync models with the db
(async () => {
  await sequelize.sync({force: false});
  console.log('Connected to database and synced models');
})();


// home page
app.get('/', (req, res) => {
    res.sendFile(__dirname +'/public/login.html');
  });

  // signup
app.post('/signup', async (req, res) => {
    const { name, email, password } = req.body;
  
    try {
      // check if user already exists
      const existingUser = await User.findOne({ where: { email } });
      if (existingUser) {
        return res.status(403).json({ success: false, message: 'User already exists' });
      }
      // create a new user does not exist
      const hashedPassword = bcrypt.hashSync(password, salt);
        await User.create({ name, email, password: hashedPassword });
      res.status(200).json({ success: true });
      
    } catch (error) {
      console.error('Error creating user:', error);
      res.status(500).json({ success: false });
    }
  });
  
// login
app.post('/login', async (req, res) => {
    const { email, password } = req.body;
  
    try {
      const user = await User.findOne({where:{email}});
  
      if (!user) {
        return res.status(404).json({ success: false, message: 'User not found' });
      }
        const passwordMatch = bcrypt.compareSync(password, user.password);
        console.log(user.password);
        if (!passwordMatch) {
            return res.status(403).json({ success: false, message: 'Wrong mail id or password!' });
        }
        res.status(200).json({ success: true, redirectTo: '/expense.html' });

    } catch (error) {
      console.error('Error querying database:', error);
      res.status(500).json({ success: false });
    }
  });

  //  creating an expense 
  app.post('/addExpense', async (req, res) => {
    const { amount, details, category } = req.body;

    try {
        const newExpense = await Expense.create({ amount, details, category });
        res.status(200).json({ success: true, expense: newExpense });
    } catch (error) {
        console.error('Error adding expense:', error);
        res.status(500).json({ success: false });
    }
});

  // get expense 
  app.get('/expenses', async (req, res) => {
    try {
      const expenses = await Expense.findAll();
      res.status(200).json(expenses);
    } catch (error) {
      console.error('Error fetching expenses:', error);
      res.status(500).json({ success: false });
    }
  });

// deleting expense
app.post('/deleteExpense', async (req, res) => {
    const id = req.body.id; 
    console.log(id);
  
    try {
      const deletedExpense = await Expense.findByPk(id);
      if (!deletedExpense) {
        return res.status(404).json({ success: false, message: 'Expense not found' });
      }
      await deletedExpense.destroy();
      res.status(200).json({ success: true });
    } catch (error) {
      console.error('Error deleting expense:', error);
      res.status(500).json({ success: false });
    }
  });
// listening port
const port = 3000;
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
