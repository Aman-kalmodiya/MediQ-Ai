const mongoose = require('mongoose');
const slotSchema = new mongoose.Schema({
  date: { type: String, required: true },      
  startTime: { type: String, required: true },  
  endTime: { type: String, required: true },    
  isBooked: { type: Boolean, default: false },
});

const doctorSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  name: { type: String, required: true, trim: true },
  department: { type: String, required: true, trim: true },
  hospitalId: { type: mongoose.Schema.Types.ObjectId, ref: 'Hospital', required: true },
  experienceYears: { type: Number, default: 0, min: 0 },
  photoUrl: { type: String, default: '' },
  slots: [slotSchema],
});

doctorSchema.index({ department: 1, hospitalId: 1 });

module.exports = mongoose.model('Doctor', doctorSchema);