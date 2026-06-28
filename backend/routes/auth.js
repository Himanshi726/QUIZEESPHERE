const express = require('express');
const crypto = require('crypto');
const User = require('../models/User');
const sendEmail = require('../utils/sendEmail');
const { protect } = require('../middleware/auth');

const router = express.Router();

const sendTokenResponse = (user, statusCode, res) => {
  // Create token
  const token = require('jsonwebtoken').sign({ id: user._id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRE || '30d'
  });

  const options = {
    expires: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax'
  };

  res.status(statusCode).cookie('token', token, options).json({
    success: true,
    token,
    user: {
      id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      isVerified: user.isVerified
    }
  });
};

// @desc    Register user
// @route   POST /api/auth/register
// @access  Public
router.post('/register', async (req, res) => {
  try {
    const { name, email, password, role, adminSecret } = req.body;

    // Check if user exists
    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({ success: false, error: 'User already exists' });
    }

    let assignedRole = 'user';
    if (role === 'admin') {
      if (adminSecret !== process.env.ADMIN_SECRET) {
        return res.status(403).json({ success: false, error: 'Invalid admin secret key' });
      }
      assignedRole = 'admin';
    }

    // Generate verification token
    const verificationToken = crypto.randomBytes(20).toString('hex');
    const hashedToken = crypto.createHash('sha256').update(verificationToken).digest('hex');

    const user = await User.create({
      name,
      email,
      password,
      role: assignedRole,
      verificationToken: hashedToken,
      verificationTokenExpire: Date.now() + 24 * 60 * 60 * 1000 // 24 hours
    });

    // Send verification email
    const verifyUrl = `${process.env.FRONTEND_URL}/verify/${verificationToken}`;

    try {
      await sendEmail({
        email: user.email,
        subject: 'Verify your Quizeesphere account',
        message: `Welcome to Quizeesphere, ${name}! Please verify your email address to activate your account. This link expires in 24 hours.`,
        link: verifyUrl,
        linkText: 'Verify My Email'
      });

      res.status(200).json({ success: true, data: 'Verification email sent! Please check your inbox.' });
    } catch (err) {
      console.error(err);
      user.verificationToken = undefined;
      user.verificationTokenExpire = undefined;
      await user.save({ validateBeforeSave: false });
      return res.status(500).json({ success: false, error: 'Email could not be sent' });
    }

  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// @desc    Verify Email
// @route   GET /api/auth/verify/:token
// @access  Public
router.get('/verify/:token', async (req, res) => {
  try {
    const hashedToken = crypto.createHash('sha256').update(req.params.token).digest('hex');

    const user = await User.findOne({
      verificationToken: hashedToken,
      verificationTokenExpire: { $gt: Date.now() }
    });

    if (!user) {
      return res.status(400).json({ success: false, error: 'Invalid or expired token' });
    }

    user.isVerified = true;
    user.verificationToken = undefined;
    user.verificationTokenExpire = undefined;
    await user.save();

    res.status(200).json({ success: true, message: 'Email verified successfully. You can now log in.' });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// @desc    Login user
// @route   POST /api/auth/login
// @access  Public
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ success: false, error: 'Please provide email and password' });
    }

    const user = await User.findOne({ email }).select('+password');

    if (!user) {
      return res.status(401).json({ success: false, error: 'Invalid credentials' });
    }

    const isMatch = await user.matchPassword(password);

    if (!isMatch) {
      return res.status(401).json({ success: false, error: 'Invalid credentials' });
    }

    if (!user.isVerified) {
       return res.status(401).json({ success: false, error: 'Please verify your email before logging in' });
    }

    sendTokenResponse(user, 200, res);
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// @desc    Logout user / clear cookie
// @route   POST /api/auth/logout
// @access  Private
router.post('/logout', protect, (req, res) => {
  res.cookie('token', 'none', {
    expires: new Date(Date.now() + 10 * 1000),
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax'
  });

  res.status(200).json({ success: true, data: {} });
});

// @desc    Get current logged in user
// @route   GET /api/auth/me
// @access  Private
router.get('/me', protect, async (req, res) => {
  const user = await User.findById(req.user.id);
  res.status(200).json({ success: true, data: user });
});

module.exports = router;
