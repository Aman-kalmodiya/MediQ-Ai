const AppError = require('../utils/AppError');

module.exports = (...allowedRoles) => (req, res, next) => {
  if (!req.user || !allowedRoles.includes(req.user.role)) {
    return next(new AppError(403, 'You do not have permission to do this'));
  }
  next();
};