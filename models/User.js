
const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  name: String,
  email: String,
  lifestyle: [String],
  preferences:[String],
  budget: Number,
  location: String
});

module.exports = mongoose.model('User', userSchema);
