import {User} from '../models/User.js';


export const getExpenseLeaderboard = async (req, res) => {
  try {
    console.log('Fetching leaderboard data...');
    const leaderboard = await User.findAll({
      attributes: ['id', 'name', 'totalExpense'],
      order: [['totalExpense', 'DESC']],
    });
    // console.log('Leaderboard data:', leaderboard);
    res.status(200).json(leaderboard);
  } catch (error) {
    console.error('Error querying leaderboard:', error);
    res.status(500).json({ error: 'Error querying leaderboard' });
  }
};

export default {
  getExpenseLeaderboard,
};
