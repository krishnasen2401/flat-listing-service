
const mongoose = require('mongoose');

const lifeStyleTagSchema = new mongoose.Schema({
  name: String
});

module.exports = mongoose.model('LifeStyleTag', lifeStyleTagSchema);
