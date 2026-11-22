const Hospital = require('../models/Hospital');
const Doctor = require('../models/Doctor');
const AppError = require('../utils/AppError');
const asyncHandler = require('../utils/asyncHandler');
const { isNonEmpty } = require('../utils/validate');

const pick = (b) => ({
  name: b.name,
  city: b.city,
  address: b.address,
  phone: b.phone,
  departments: Array.isArray(b.departments) ? b.departments.map(String) : undefined,
});

exports.list = asyncHandler(async (req, res) => {
  const filter = {};
  if (req.query.city) {
    const safeCity = String(req.query.city).replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    filter.city = new RegExp(`^${safeCity}$`, 'i');
  }
  const hospitals = await Hospital.find(filter).sort('name');
  res.json(hospitals);
});

exports.create = asyncHandler(async (req, res) => {
  if (!isNonEmpty(req.body.name, 2, 120) || !isNonEmpty(req.body.city, 2, 80)) {
    throw new AppError(400, 'Hospital name and city required');
  }
  const hospital = await Hospital.create(pick(req.body));
  res.status(201).json(hospital);
});

exports.update = asyncHandler(async (req, res) => {
  const data = pick(req.body);
  Object.keys(data).forEach((k) => data[k] === undefined && delete data[k]);

  const hospital = await Hospital.findByIdAndUpdate(req.params.id, data, {
    new: true,
    runValidators: true,
  });
  if (!hospital) throw new AppError(404, 'Hospital not found');
  res.json(hospital);
});

exports.remove = asyncHandler(async (req, res) => {
  if (await Doctor.exists({ hospitalId: req.params.id })) {
    throw new AppError(409, "Remove or move this hospital's doctors first");
  }
  const hospital = await Hospital.findByIdAndDelete(req.params.id);
  if (!hospital) throw new AppError(404, 'Hospital not found');
  res.json({ message: 'Hospital deleted' });
});