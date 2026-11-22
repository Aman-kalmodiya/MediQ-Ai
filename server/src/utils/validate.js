const isEmail = (value) =>
  typeof value === 'string' && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value.trim());

const isPhone = (value) =>
  typeof value === 'string' && /^[6-9]\d{9}$/.test(value.trim());

const isNonEmpty = (value, min = 1, max = 200) =>
  typeof value === 'string' &&
  value.trim().length >= min &&
  value.trim().length <= max;
const collect = (checks) => Object.values(checks).filter(Boolean);

module.exports = { isEmail, isPhone, isNonEmpty, collect };