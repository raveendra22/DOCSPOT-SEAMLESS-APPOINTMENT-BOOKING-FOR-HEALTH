const mongoose = require("mongoose");

const doctorSchema = new mongoose.Schema({
  name: String,
  email: { type: String, unique: true },
  phone: String,
  password: String,
  role: { type: String, default: "doctor" },
  specialization: String,
  experience: Number,
  address: String,
  fees: Number,
  timing: String
});

module.exports = mongoose.model("Doctor", doctorSchema);
