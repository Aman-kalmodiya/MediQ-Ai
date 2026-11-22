const mongoose = require('mongoose');

const reportSchema = new mongoose.Schema(
  {
    appointmentId: { type: mongoose.Schema.Types.ObjectId, ref: 'Appointment', required: true },
    fileUrl: String,
    extractedText: String,
    aiSummary: String,
    language: { type: String, enum: ['hindi', 'english'], default: 'english' },
  },
  { timestamps: { createdAt: true, updatedAt: false } }
);

module.exports = mongoose.model('Report', reportSchema);