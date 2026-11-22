const rateLimit = require('express-rate-limit');

const make = (windowMinutes, max, message) =>
  rateLimit({
    windowMs: windowMinutes * 60 * 1000,
    max,
    standardHeaders: true,
    legacyHeaders: false,
    message: { message },
  });

module.exports = {

  generalLimiter: make(15, 300, 'Too many requests, please try again later'),
  
  authLimiter: make(15, 20, 'Too many login attempts, please try again later'),

  publicTriageLimiter: make(15, 30, 'Too many triage requests, please wait a bit'),
};