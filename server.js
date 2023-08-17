const express = require('express');
const bodyParser = require('body-parser');
const User = require('./models/User'); 
const sequelize = require('./db/database');
const bcrypt = require('bcryptjs');
const salt = bcrypt.genSaltSync(10);

const app = express();

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.use(express.static('public'));

// Sync models with the db
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
      const user = await User.findOne({where:{email}});
  
      if (!user) {
        return res.status(404).json({ success: false, message: 'User not found' });
      }
        const passwordMatch = bcrypt.compareSync(password, user.password);
        console.log(user.password);
        if (!passwordMatch) {
            return res.status(403).json({ success: false, message: 'Wrong mail id or password!' });
        }
        res.json({ success: true });

    } catch (error) {
      console.error('Error querying database:', error);
      res.json({ success: false });
    }
  });
  
const port = 3000;
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
