const mongoose = require('mongoose');

const appointmentSchema = new mongoose.Schema(
  {
    patientId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    guestName: String,
    guestPhone: String,
    doctorId: { type: mongoose.Schema.Types.ObjectId, ref: 'Doctor', required: true },
    hospitalId: { type: mongoose.Schema.Types.ObjectId, ref: 'Hospital', required: true },
    slot: { date: String, startTime: String, endTime: String },
    symptoms: { type: String, required: true },
    aiUrgency: { type: String, enum: ['low', 'medium', 'high', 'emergency'], default: 'medium' },
    aiDepartment: String,
    aiReason: String,
    tokenNumber: { type: Number, required: true },
    status: {
      type: String,
      enum: ['booked', 'in_queue', 'in_consultation', 'completed', 'cancelled'],
      default: 'booked',
    },
  },
  { timestamps: { createdAt: true, updatedAt: false } }
);

appointmentSchema.index({ doctorId: 1, status: 1 });

module.exports = mongoose.model('Appointment', appointmentSchema);