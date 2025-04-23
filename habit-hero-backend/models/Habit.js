const mongoose = require('mongoose');
const HabitSchema = new mongoose.Schema({
  user:       { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  title:      String,
  frequency:  Number,
  color:      String,
  currentStreak: { type: Number, default: 0 },
  lastChecked:   { type: Date, default: null }
});
module.exports = mongoose.model('Habit', HabitSchema);
