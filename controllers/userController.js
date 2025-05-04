const User = require('../models/User');

// Create a user
exports.createUser = async (req, res) => {
  try {
    const user = new User(req.body);
    const savedUser = await user.save();
    res.status(201).json(savedUser);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

// Update a user
exports.updateUser = async (req, res) => {
  try {
    const updatedUser = await User.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!updatedUser) return res.status(404).json({ message: 'User not found' });
    res.json(updatedUser);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

// Delete a user
exports.deleteUser = async (req, res) => {
  try {
    const deletedUser = await User.findByIdAndDelete(req.params.id);
    if (!deletedUser) return res.status(404).json({ message: 'User not found' });
    res.json({ message: 'User deleted successfully' });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

// Get all users (with optional search & filter)
exports.getUsers = async (req, res) => {
  try {
    const { lifestyle, preferences, minBudget, maxBudget, location, name } = req.query;

    const query = {};

    if (lifestyle) query.lifestyle = { $in: lifestyle.split(',') };
    if (preferences) query.preferences = { $in: preferences.split(',') };
    if (location) query.location = new RegExp(location, 'i');
    if (name) query.name = new RegExp(name, 'i');

    if (minBudget || maxBudget) {
      query.budget = {};
      if (minBudget) query.budget.$gte = Number(minBudget);
      if (maxBudget) query.budget.$lte = Number(maxBudget);
    }

    const users = await User.find(query);
    res.json(users);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};
