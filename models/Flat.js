
const mongoose = require('mongoose');

const flatSchema = new mongoose.Schema({
  title: String,
  description: String,
  location: String,
  price: Number,
  landlordId: String,
  tenantIds: [String],
  preferences: [String],
  amenities: [String],
  availableFrom: Date,
  managerId: String
});

module.exports = mongoose.model('Flat', flatSchema);
