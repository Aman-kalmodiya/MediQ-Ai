const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const { jwtSecret, jwtExpiresIn } = require('../config/env');
const AppError = require('../utils/AppError');
const asyncHandler = require('../utils/asyncHandler');
const { isEmail, isPhone, isNonEmpty, collect } = require('../utils/validate');


const signToken = (user) =>
  jwt.sign({ id: user._id, role: user.role }, jwtSecret, { expiresIn: jwtExpiresIn });


const publicUser = (u) => ({
  id: u._id,
  name: u.name,
  email: u.email,
  phone: u.phone,
  role: u.role,
});

exports.register = asyncHandler(async (req, res) => {
  const { name, email, phone, password } = req.body;

  const errors = collect({
    name: isNonEmpty(name, 2, 80) ? null : 'Name must be 2-80 characters',
    email: isEmail(email) ? null : 'Valid email required',
    phone: phone === undefined || isPhone(phone) ? null : 'Phone must be a 10-digit Indian mobile number',
    password: isNonEmpty(password, 8, 100) ? null : 'Password must be at least 8 characters',
  });
  if (errors.length) throw new AppError(400, errors.join(', '));

  const passwordHash = await bcrypt.hash(password, 10);
  const user = await User.create({ name, email, phone, passwordHash, role: 'patient' });

  res.status(201).json({ token: signToken(user), user: publicUser(user) });
});


exports.login = asyncHandler(async (req, res) => {
  const { email, password } = req.body;
  if (!isEmail(email) || typeof password !== 'string') {
    throw new AppError(400, 'Email and password required');
  }

  const user = await User.findOne({ email: email.toLowerCase().trim() }).select('+passwordHash');
  const ok = user && (await bcrypt.compare(password, user.passwordHash));
  if (!ok) throw new AppError(401, 'Wrong email or password');

  res.json({ token: signToken(user), user: publicUser(user) });
});

exports.me = asyncHandler(async (req, res) => {
  res.json({ user: publicUser(req.user) });
});