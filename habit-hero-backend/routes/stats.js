const express = require('express');
const router  = express.Router();
const auth    = require('../middleware/auth');
const Habit   = require('../models/Habit');
const User    = require('../models/User');

// GET /api/stats — summary + top heroes
router.get('/', auth, async (req, res) => {
  // 1) Your stats
  const yourHabits = await Habit.find({ user: req.user.id });
  const completedToday = yourHabits.filter(h => 
    h.lastChecked && h.lastChecked.toDateString() === new Date().toDateString()
  ).length;

  // 2) Leaderboard: top 5 users by total streak across all their habits
  const allHabits = await Habit.find().populate('user', ['name']);
  const scores = {};
  allHabits.forEach(h => {
    const uid = h.user.id;
    scores[uid] = (scores[uid] || 0) + h.currentStreak;
  });
  const heroes = Object.entries(scores)
    .sort(([,a],[,b]) => b - a)
    .slice(0,5)
    .map(([uid,score]) => ({ name: allHabits.find(h=>h.user.id===uid).user.name, score }));

  res.json({
    your: {
      totalHabits: yourHabits.length,
      completedToday
    },
    heroes
  });
});

module.exports = router;
