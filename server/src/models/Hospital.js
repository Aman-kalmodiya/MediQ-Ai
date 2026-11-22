const mongoose = require('mongoose');

const hospitalSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  city: { type: String, required: true, trim: true },
  address: { type: String, trim: true },
  phone: { type: String, trim: true },
  departments: [{ type: String, trim: true }],
});

module.exports = mongoose.model('Hospital', hospitalSchema);