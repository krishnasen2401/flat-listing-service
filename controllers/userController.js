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
      const {
        lifestyle,
        preferences,
        location,
        minBudget,
        maxBudget,
        gender,
        name,
        matchMode = 'any' // default is OR logic
      } = req.query;
  
      const query = {};
  
      const parseArray = (val) => val ? val.split(',') : [];
  
      const applyArrayMatch = (field, values) => {
        if (values.length === 0) return;
  
        if (matchMode === 'all') {
          // AND logic: user must have all values
          query[field] = { $all: values };
        } else {
          // OR logic: user must have at least one value
          query[field] = { $in: values };
        }
      };
  
      applyArrayMatch('lifestyle', parseArray(lifestyle));
      applyArrayMatch('preferences', parseArray(preferences));
  
      if (location) {
        const locations = parseArray(location);
        if (matchMode === 'all') {
          query.location = { $all: locations };
        } else {
          query.location = { $in: locations };
        }
      }
  
      if (gender) query.gender = gender;
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
  
