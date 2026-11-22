const bcrypt = require('bcrypt');
const Doctor = require('../models/Doctor');
const User = require('../models/User');
const Hospital = require('../models/Hospital');
const AppError = require('../utils/AppError');
const asyncHandler = require('../utils/asyncHandler');
const { isEmail, isNonEmpty, collect } = require('../utils/validate');

exports.list = asyncHandler(async (req, res) => {
  const filter = {};
  if (req.query.department) filter.department = String(req.query.department);
  if (req.query.hospitalId) filter.hospitalId = String(req.query.hospitalId);

  const doctors = await Doctor.find(filter)
    .populate('hospitalId', 'name city')
    .sort('name')
    .lean();

  doctors.forEach((d) => {
    d.slots = d.slots.filter((s) => !s.isBooked);
  });
  res.json(doctors);
});

exports.create = asyncHandler(async (req, res) => {
  const { name, email, password, department, hospitalId, experienceYears, photoUrl } = req.body;

  const errors = collect({
    name: isNonEmpty(name, 2, 80) ? null : 'Doctor name required',
    email: isEmail(email) ? null : 'Valid email required',
    password: isNonEmpty(password, 8, 100) ? null : 'Password must be at least 8 characters',
    department: isNonEmpty(department, 2, 60) ? null : 'Department required',
    hospitalId: hospitalId ? null : 'hospitalId required',
  });
  if (errors.length) throw new AppError(400, errors.join(', '));

  if (!(await Hospital.exists({ _id: hospitalId }))) {
    throw new AppError(404, 'Hospital not found');
  }

  const passwordHash = await bcrypt.hash(password, 10);
  const user = await User.create({ name, email, passwordHash, role: 'doctor' });

  try {
    const doctor = await Doctor.create({
      userId: user._id,
      name,
      department,
      hospitalId,
      experienceYears,
      photoUrl,
    });
    res.status(201).json(doctor);
  } catch (err) {
    await User.findByIdAndDelete(user._id);
    throw err;
  }
});

exports.update = asyncHandler(async (req, res) => {
  const { name, department, hospitalId, experienceYears, photoUrl } = req.body;
  const data = { name, department, hospitalId, experienceYears, photoUrl };
  Object.keys(data).forEach((k) => data[k] === undefined && delete data[k]);

  const doctor = await Doctor.findByIdAndUpdate(req.params.id, data, {
    new: true,
    runValidators: true,
  });
  if (!doctor) throw new AppError(404, 'Doctor not found');

  if (data.name) await User.findByIdAndUpdate(doctor.userId, { name: data.name });
  res.json(doctor);
});

exports.remove = asyncHandler(async (req, res) => {
  const doctor = await Doctor.findByIdAndDelete(req.params.id);
  if (!doctor) throw new AppError(404, 'Doctor not found');

  await User.findByIdAndDelete(doctor.userId);
  res.json({ message: 'Doctor deleted' });
});