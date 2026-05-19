const jwt = require('jsonwebtoken');
const User = require('../models/User');

const signToken = (id) => jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: '30d' });

exports.register = async (req, res) => {
  return res.status(403).json({ message: 'Registration is disabled. Contact admin.' });
};

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const adminEmail = process.env.ADMIN_EMAIL;
    const adminPassword = process.env.ADMIN_PASSWORD;

    if (adminEmail && adminPassword && email === adminEmail && password === adminPassword) {
      let user = await User.findOne({ email: adminEmail });
      if (!user) {
        user = await User.create({ name: 'Admin', email: adminEmail, password: adminPassword, isAdmin: true });
      } else if (!user.isAdmin) {
        user.isAdmin = true;
        await user.save();
      }
      return res.json({ _id: user._id, name: user.name, email: user.email, isAdmin: true, token: signToken(user._id) });
    }

    const user = await User.findOne({ email });
    if (!user || !(await user.matchPassword(password))) return res.status(401).json({ message: 'Invalid credentials' });
    if (!user.isAdmin) return res.status(403).json({ message: 'Admin access only' });
    res.json({ _id: user._id, name: user.name, email: user.email, isAdmin: user.isAdmin, token: signToken(user._id) });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.getProfile = async (req, res) => {
  res.json(req.user);
};

exports.updateProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    user.name = req.body.name || user.name;
    user.phone = req.body.phone || user.phone;
    user.address = req.body.address || user.address;
    if (req.body.password) user.password = req.body.password;
    const updated = await user.save();
    res.json({ _id: updated._id, name: updated.name, email: updated.email, isAdmin: updated.isAdmin, token: signToken(updated._id) });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
