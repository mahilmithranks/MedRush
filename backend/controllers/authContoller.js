const crypto = require('crypto');
const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const sendEmail = require('../utils/sendEmail');

exports.register = async (req, res) => {
  try {
    const { name, email, phone, password, role } = req.body;
    if (!name || !email || !password) return res.status(400).json({ msg: 'Missing required fields' });

    let user = await User.findOne({ email });
    if (user) return res.status(400).json({ msg: 'User already exists' });

    const salt = await bcrypt.genSalt(10);
    const hashed = await bcrypt.hash(password, salt);

    const emailToken = crypto.randomBytes(20).toString('hex');
    const emailTokenExpires = Date.now() + 24 * 3600 * 1000; // 24h

    user = new User({
      name,
      email,
      phone,
      password: hashed,
      role,
      emailVerificationToken: emailToken,
      emailVerificationExpires: emailTokenExpires
    });

    await user.save();

    const verifyUrl = `${process.env.CLIENT_URL}/verify-email?token=${emailToken}&email=${encodeURIComponent(email)}`;
    await sendEmail(email, 'Verify your MedRush account', `Click to verify: ${verifyUrl}`);

    res.status(201).json({ msg: 'Registered. Verification email sent.' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: 'Server error' });
  }
};

exports.verifyEmail = async (req, res) => {
  try {
    const { token, email } = req.query;
    if (!token || !email) return res.status(400).send('Invalid request');

    const user = await User.findOne({
      email,
      emailVerificationToken: token,
      emailVerificationExpires: { $gt: Date.now() }
    });

    if (!user) return res.status(400).send('Invalid or expired token');

    user.isVerified = true;
    user.emailVerificationToken = undefined;
    user.emailVerificationExpires = undefined;
    await user.save();

    return res.send('Email verified. You can now log in.');
  } catch (err) {
    console.error(err);
    res.status(500).send('Server error');
  }
};

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) return res.status(400).json({ msg: 'Missing fields' });

    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ msg: 'Invalid credentials' });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ msg: 'Invalid credentials' });

    if (!user.isVerified) return res.status(400).json({ msg: 'Please verify your email first' });

    const payload = { user: { id: user.id, role: user.role } };
    const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '7d' });

    res.json({ token });
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: 'Server error' });
  }
};

exports.requestOtp = async (req, res) => {
  try {
    const { phone } = req.body;
    if (!phone) return res.status(400).json({ msg: 'Phone required' });

    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const expires = Date.now() + 5 * 60 * 1000; // 5 minutes

    let user = await User.findOne({ phone });
    if (!user) {
      user = new User({
        name: '',
        email: `${phone}@phone.local`,
        phone,
        password: crypto.randomBytes(8).toString('hex'),
        phoneVerified: false
      });
    }

    user.otp = otp;
    user.otpExpires = expires;
    await user.save();

    // TODO: integrate Twilio/Fast2SMS here to actually send the OTP.
    console.log(`DEBUG OTP for ${phone}: ${otp}`);

    res.json({ msg: 'OTP sent (in dev mode shown in server logs)' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: 'Server error' });
  }
};

exports.verifyOtp = async (req, res) => {
  try {
    const { phone, otp } = req.body;
    const user = await User.findOne({ phone, otp, otpExpires: { $gt: Date.now() } });
    if (!user) return res.status(400).json({ msg: 'Invalid or expired OTP' });

    user.phoneVerified = true;
    user.otp = undefined;
    user.otpExpires = undefined;
    await user.save();

    const payload = { user: { id: user.id, role: user.role } };
    const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '7d' });

    res.json({ token });
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: 'Server error' });
  }
};

exports.me = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('-password -otp -otpExpires');
    res.json(user);
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: 'Server error' });
  }
};

// NEW: Update Role
exports.updateRole = async (req, res) => {
  try {
    const { role } = req.body;
    const validRoles = ['customer', 'pharmacist', 'delivery', 'admin'];

    if (!validRoles.includes(role)) {
      return res.status(400).json({ msg: 'Invalid role' });
    }

    const user = await User.findById(req.user.id);
    if (!user) return res.status(404).json({ msg: 'User not found' });

    user.role = role;
    await user.save();

    res.json({ msg: 'Role updated successfully', role: user.role });
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: 'Server error' });
  }
};
