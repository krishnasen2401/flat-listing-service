const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  name: String,
  email: String,
  lifestyle: [String],
  preferences: [String],
  budget: Number,
  location: String,
  gender: {
    type: String,
    enum: ['male', 'female', 'non-binary', 'other'],
  }
});

module.exports = mongoose.model('User', userSchema);