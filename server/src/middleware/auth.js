const jwt = require('jsonwebtoken');
const { jwtSecret } = require('../config/env');
const User = require('../models/User');
const AppError = require('../utils/AppError');
const asyncHandler = require('../utils/asyncHandler');

module.exports = asyncHandler(async (req, res, next) => {
  const header = req.headers.authorization || '';
  const token = header.startsWith('Bearer ') ? header.slice(7) : null;
  if (!token) throw new AppError(401, 'Login required');

  let payload;
  try {
    payload = jwt.verify(token, jwtSecret);
  } catch {
    throw new AppError(401, 'Invalid or expired token');
  }

  const user = await User.findById(payload.id);
  if (!user) throw new AppError(401, 'User no longer exists');

  req.user = user;
  next();
});