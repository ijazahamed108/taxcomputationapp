const express = require('express');
const  router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
require('dotenv').config();
const { verifyToken } = require('../middleware/jwtAuthMiddleware')

// Check if userId and email are unique
router.post('/check-unique', async (req, res) => {
  try {
    const { userId, email } = req.body;
    const existingUserId = await User.findOne({ userId });
    const existingEmail = await User.findOne({ email });
    res.json({
      isUserIdUnique: !existingUserId,
      isEmailUnique: !existingEmail,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

router.post('/computetax',verifyToken, async (req, res) => {
  try {
    const { userId, email } = req.body;
    const existingUserId = await User.findOne({ userId });
    const existingEmail = await User.findOne({ email });
    res.json({
      isUserIdUnique: !existingUserId,
      isEmailUnique: !existingEmail,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});
router.get('/user-info', verifyToken, async (req, res) => {
  try {
    // Fetch user information from the database based on the user ID in the token
    const user = await User.findById(req.user.userId);

    // Sending back user information to the client
    res.json({
      userId: user.userId,
      email: user.email,
      state: user.state,
      country: user.country,
      role: user.role,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

router.post('/login', async (req, res) => {
  try {
    const { userId, password } = req.body;

    // Find the user by userId
    const user = await User.findOne({ userId });

    // Check if the user exists already in system
    if (!user) {
      return res.status(401).json({ error: 'Invalid credentials, please try again' });
    }

    // validate paswords
    const isPasswordValid = bcrypt.compareSync(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({ error: 'Invalid credentials, please try again' });
    }

    // Generate JWT token
    const token = jwt.sign({ userId: user._id, role: user.role }, process.env.JWT_SECRET);
    res.json({ token, role: user.role });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// Signup route
router.post('/signup', async (req, res) => {
  try {
    const { name, userId, email, password } = req.body;

    // Check if userId and email are unique again (double-check)
    const existingUserId = await User.findOne({ userId });
    const existingEmail = await User.findOne({ email });
    if (existingUserId) {
      return res.status(400).json({ error: 'UserID not available, please try a different one.' });
    }

    if (existingEmail) {
      return res.status(400).json({ error: 'Email is already in use, please use a different one.' });
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create a new user
    const newUser = new User({
      name,
      userId,
      email,
      password: hashedPassword,
      country,
      state
    });

    // Save the user to the database
    await newUser.save();

    // Generate JWT token
    const token = jwt.sign({ userId: newUser._id, role: newUser.role }, process.env.JWT_SECRET);
    res.json({ token });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

module.exports = router;
