import express from 'express';
import bodyParser from 'body-parser';
import crypto from 'crypto';
import cors from 'cors';
import path from 'path';
import { fileURLToPath } from 'url';
import { dirname as pathDirname } from 'path';
import helmet from 'helmet';
import morgan from 'morgan';
import fs from 'fs';

import { User } from './models/User.js';
import { sequelize } from './db/database.js';
import { Expense } from './models/Expense.js';
import Order from './models/Order.js';
import { ForgotPassword } from './models/Forgot.js';
import userRoutes from './routes/userRoutes.js';
import expenseRoutes from './routes/expenseRoutes.js';
import premiumRoutes from './routes/purchaseRoutes.js';
import statusRoutes from './routes/memebrshipStatusRoute.js';
import showLeaderBoardRoutes from './routes/showleaderboardRoute.js';
import forgotPasswordRoute from './routes/forgotPasswordRoutes.js';
import resetPasswordRoute from './routes/resetPasswordRoute.js';
import fileRoutes from './routes/fileRoutes.js';

const app = express();

// DIR setup
const currentDirname = pathDirname(fileURLToPath(import.meta.url));

const accessLogStream = fs.createWriteStream(
  path.join(currentDirname, 'access.log'),{
    flags: 'a'
  })

// middleware
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(cors());
app.use(helmet());
app.use(morgan('combined',{ stream: accessLogStream}));

app.use(
  helmet.contentSecurityPolicy({
    directives: {
      defaultSrc: ["'self'", 'data:', 'blob:'],
      fontSrc: ["'self'", 'https:', 'data:'],
      styleSrc: ["'self'", 'https:', 'unsafe-inline'], // Allowing 'unsafe-inline' for styles
      // styleSrc: ["'self'", 'https:', "'WI9VhGtWyrOPu6EP5fgOjg=='"],
      // scriptSrc: ["'self'", 'unsafe-inline', 'https://checkout.razorpay.com/v1/checkout.js'], // Allowing 'unsafe-inline' for scripts from Razorpay
      scriptSrcElem: ["'self'", 'https:', 'https://*.cloudflare.com'],
      // styleSrc: ["'self'", 'https:', 'unsafe-inline'],
      // connectSrc: ["'self'", 'data', 'https://*.cloudflare.com', 'https://lumberjack-cx.razorpay.com'],
      // frameSrc: ["'self'", 'https://api.razorpay.com']
    },
  })
);
const generateNonce = () => {
  return crypto.randomBytes(16).toString('base64');
};

let nonce = generateNonce();

app.use((req, res, next) => {

  nonce = generateNonce();
  console.log("nonce: ", nonce);
  res.setHeader(
    'Content-Security-Policy',
    `style-src 'self' https: 'nonce-${nonce}'`
  );

  next();
});

// relationships between models
User.hasMany(Expense);
Expense.belongsTo(User);
User.hasMany(Order);
Order.belongsTo(User);
User.hasMany(ForgotPassword, {
  foreignKey: 'userId',
  onDelete: 'CASCADE',
});
ForgotPassword.belongsTo(User, { foreignKey: 'userId' });

// static files from the 'views' directory
app.use(express.static(path.join(currentDirname, 'views')));


app.use(userRoutes);
app.use('/expense', expenseRoutes);
app.use('/purchase', premiumRoutes);
app.use('/checkstatus', statusRoutes);
app.use('/leaderboard', showLeaderBoardRoutes);
app.use('/forgotpassword', forgotPasswordRoute);
app.use('/', resetPasswordRoute);
app.use('/', fileRoutes);

// login.html as the default route
app.get('/', (req, res) => {
  res.sendFile(path.join(currentDirname, 'views', 'login.html'));
});


const port = process.env.PORT || 3001;
(async () => {
  try {
    await sequelize.authenticate();
    console.log('Connected to the database');

    await sequelize.sync({ force: false });
    console.log('Synced models with the database');

    app.listen(port, () => {
      console.log(`Server is running on port ${port}`);
    });
  } catch (error) {
    console.error('Unable to connect to the database:', error);
  }
})();
