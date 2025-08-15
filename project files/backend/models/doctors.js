const mongoose = require('mongoose');

const doctorSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  phone: { type: String },
  password: { type: String, required: true },
  specialization: { type: String },
  experience: { type: Number },
  address: { type: String },
  fees: { type: Number },
  timing: { type: String },
  role: { type: String, enum: ['doctor'], default: 'doctor' }
});

const Doctor = mongoose.models.Doctor || mongoose.model('Doctor', doctorSchema);

module.exports = Doctor;
