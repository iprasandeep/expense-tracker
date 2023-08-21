const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const User = require('./models/User'); 
const sequelize = require('./db/database');
const Expense = require('./models/Expense');
const Order = require('./models/Order');

// routes
const userRoutes = require('./routes/userRoutes');
const expenseRoutes = require('./routes/expenseRoutes');
const premiumRoutes = require('./routes/purchaseRoutes');
const statusRoutes = require('./routes/memebrshipStatusRoute');
const showLeaderBoardRoutes = require('./routes/showleaderboardRoute');


app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.use(userRoutes);
app.use(express.static('views'));


// relation between User and Expenses 
User.hasMany(Expense);
Expense.belongsTo(User);
// relation between User and Order
User.hasMany(Order);
Order.belongsTo(User);

app.get('/', (req, res) => {
  res.sendFile(__dirname + '/views/login.html');
});

app.use('/',userRoutes);
app.use('/expense',expenseRoutes);
app.use('/purchase',premiumRoutes);
app.use('/checkstatus',statusRoutes);
app.use('/leaderboard', showLeaderBoardRoutes);

(async () => {
  await sequelize.sync({ force: false });
  console.log('Connected to database and synced models');
  const port = process.env.PORT || 3010;
  app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
  });
})();




