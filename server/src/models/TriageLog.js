const mongoose = require('mongoose');

const triageLogSchema = new mongoose.Schema(
  {
    symptoms: String,
    urgency: { type: String, enum: ['low', 'medium', 'high', 'emergency'] },
    department: String,
    isEmergency: { type: Boolean, default: false },
  },
  { timestamps: { createdAt: true, updatedAt: false } }
);

module.exports = mongoose.model('TriageLog', triageLogSchema);