const express = require('express');
const bodyParser = require('body-parser');
const User = require('./models/User'); 
const sequelize = require('./db/database');

const app = express();
const port = 3000;

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.use(express.static('public'));

// Sync models with the db
(async () => {
  await sequelize.sync({force: true});
  console.log('Connected to database and synced models');
})();

// signup
app.post('/signup', async (req, res) => {
    const { name, email, password } = req.body;
  
    try {
      //if user already exists
      const existingUser = await User.findOne({ where: { email } });
      if (existingUser) {
        return res.json({ success: false, message: 'User already exists' });
      }
      // creating a new if user does not exist!
      const newUser = await User.create({ name, email, password });
      res.json({ success: true });
    } catch (error) {
      console.error('Error creating user:', error);
      res.json({ success: false });
    }
});

// login
app.post('/login', async (req, res) => {
    const { email, password } = req.body;
  
    try {
      const user = await User.findOne({ where: { email, password } });

      if (user) {
        res.json({ success: true });
      } else {
        res.json({ success: false, message: 'User does not exist. Please sign up.' });
        
      }
    } catch (error) {
      console.error('Error querying database:', error);
      res.json({ success: false });
    }
  });
  

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
