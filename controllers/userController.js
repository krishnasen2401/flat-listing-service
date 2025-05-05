const User = require('../models/User');

// POST /api/users
exports.createUser = async (req, res) => {
    try {
      // 1. Expect the userId to be passed in the request body
      const { userId, name, email, lifestyle, preferences, budget, location, gender } = req.body;
  
      // 2. Check if the userId is already taken (optional)
      const existingUser = await User.findOne({ userId });
      if (existingUser) {
        return res.status(400).json({ message: 'UserId already exists' });
      }
  
      // 3. Create the new user with the provided userId
      const newUser = new User({
        userId: userId,  // Use the IAM-generated userId
        name,
        email,
        lifestyle: lifestyle || [],
        preferences: preferences || [],
        budget: budget || 0,
        location: location || '',
        gender: gender || 'other',
      });
  
      // 4. Save the user to the database
      const savedUser = await newUser.save();
  
      // 5. Respond with the saved user
      res.status(201).json(savedUser);
    } catch (err) {
      res.status(500).json({ message: 'Error creating user: ' + err.message });
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
        matchMode = 'any'
      } = req.query;
  
      const query = {};
  
      const parseArray = (val) => val ? val.split(',') : [];
  
      const applyArrayMatch = (field, values) => {
        if (values.length === 0) return;
  
        if (matchMode === 'all') {
          query[field] = { $all: values };
        } else {
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

  // GET /api/users/:id
exports.getUserById = async (req, res) => {
    try {
      const user = await User.findById(req.params.id);
      if (!user) return res.status(404).json({ message: 'User not found' });
      res.json(user);
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  };

  // GET /api/users/:userId
exports.getUserByUserId = async (req, res) => {
  try {
    const user = await User.findOne({ userId: req.params.userId });

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.status(200).json(user);
  } catch (err) {
    res.status(500).json({ message: 'Error fetching user: ' + err.message });
  }
};

// PUT /api/users/:userId
exports.updateUser = async (req, res) => {
  try {
    const updatedUser = await User.findOneAndUpdate(
      { userId: req.params.userId }, // Find by userId
      {
        $set: {
          name: req.body.name,
          email: req.body.email,
          lifestyle: req.body.lifestyle,
          preferences: req.body.preferences,
          budget: req.body.budget,
          location: req.body.location,
          gender: req.body.gender,
        },
      },
      { new: true }
    );

    if (!updatedUser) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.status(200).json(updatedUser);
  } catch (err) {
    res.status(500).json({ message: 'Error updating user: ' + err.message });
  }
};

// GET /api/users/search?username=xyz
exports.searchByUsername = async (req, res) => {
  try {
    const username = req.query.username;
    const users = await User.find({ username: new RegExp(username, 'i') }); // Case-insensitive search

    if (users.length === 0) {
      return res.status(404).json({ message: 'No users found with that username' });
    }

    res.status(200).json(users);
  } catch (err) {
    res.status(500).json({ message: 'Error searching users: ' + err.message });
  }
};

  
  
