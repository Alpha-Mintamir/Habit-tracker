const express = require('express');
const router  = express.Router();
const auth    = require('../middleware/auth');
const Habit   = require('../models/Habit');

// GET /api/habits  — get all habits for logged-in user
router.get('/', auth, async (req, res) => {
  const habits = await Habit.find({ user: req.user.id });
  res.json(habits);
});

// POST /api/habits — create new
router.post('/', auth, async (req, res) => {
  const { title, frequency, color } = req.body;
  const newHabit = new Habit({ user: req.user.id, title, frequency, color });
  await newHabit.save();
  res.json(newHabit);
});

// PUT /api/habits/:id — update
router.put('/:id', auth, async (req, res) => {
  const updates = (({ title, frequency, color }) => ({ title, frequency, color }))(req.body);
  const habit = await Habit.findOneAndUpdate(
    { _id: req.params.id, user: req.user.id },
    { $set: updates },
    { new: true }
  );
  res.json(habit);
});

// DELETE /api/habits/:id — delete
router.delete('/:id', auth, async (req, res) => {
  await Habit.findOneAndDelete({ _id: req.params.id, user: req.user.id });
  res.json({ msg: 'Habit removed' });
});

// POST /api/habits/:id/log — check-in
router.post('/:id/log', auth, async (req, res) => {
  const habit = await Habit.findOne({ _id: req.params.id, user: req.user.id });
  const today = new Date().toDateString();
  if (habit.lastChecked && habit.lastChecked.toDateString() === today)
    return res.status(400).json({ msg: 'Already checked in today' });

  habit.currentStreak++;
  habit.lastChecked = new Date();
  await habit.save();
  res.json(habit);
});

module.exports = router;
