const User = require('@src/models/User');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

const SECRET_KEY = 'my-secret-key-123';

// Register a new user
exports.register = async (req, res) => {
  try {
    const { email, password, username, gender, age } = req.body;
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ error: 'Email already registered' });
    }
    const user = new User({ email, password, username, gender, age });
    await user.save();
    const token = jwt.sign({ userId: user._id }, SECRET_KEY, { expiresIn: '1h' });
    res.status(201).json({ token, user: { id: user._id, email, username, gender, age, points: user.points } });
  } catch (error) {
    res.status(500).json({ error: 'Registration failed: ' + error.message });
  }
};

// Login user
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ error: 'Invalid email or password' });
    }
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ error: 'Invalid email or password' });
    }
    const token = jwt.sign({ userId: user._id }, SECRET_KEY, { expiresIn: '1h' });
    res.json({ token, user: { id: user._id, email, username: user.username, gender: user.gender, age: user.age, points: user.points } });
  } catch (error) {
    res.status(500).json({ error: 'Login failed: ' + error.message });
  }
};

// Request password reset (mock implementation)
exports.requestPasswordReset = async (req, res) => {
  try {
    const { email } = req.body;
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    const resetToken = jwt.sign({ userId: user._id }, SECRET_KEY, { expiresIn: '15m' });
    user.resetPasswordToken = resetToken;
    user.resetPasswordExpires = Date.now() + 15 * 60 * 1000;
    await user.save();
    res.json({ message: 'Password reset token generated', resetToken });
  } catch (error) {
    res.status(500).json({ error: 'Password reset request failed: ' + error.message });
  }
};

// Reset password
exports.resetPassword = async (req, res) => {
  try {
    const { token, newPassword } = req.body;
    const user = await User.findOne({
      resetPasswordToken: token,
      resetPasswordExpires: { $gt: Date.now() },
    });
    if (!user) {
      return res.status(400).json({ error: 'Invalid or expired token' });
    }
    user.password = newPassword;
    user.resetPasswordToken = undefined;
    user.resetPasswordExpires = undefined;
    await user.save();
    res.json({ message: 'Password reset successful' });
  } catch (error) {
    res.status(500).json({ error: 'Password reset failed: ' + error.message });
  }
};
