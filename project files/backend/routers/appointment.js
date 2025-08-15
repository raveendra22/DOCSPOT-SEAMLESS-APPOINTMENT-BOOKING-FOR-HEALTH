const express = require("express");
const Appointment = require("../models/Appointment");
const jwt = require("jsonwebtoken");
const router = express.Router();

// Middleware to protect routes
function auth(req, res, next) {
  const token = req.headers.authorization?.split(" ")[1];
  if (!token) return res.status(401).json({ message: "No token provided" });

  try {
    const decoded = jwt.verify(token, "SECRET");
    req.user = decoded;
    next();
  } catch (err) {
    res.status(401).json({ message: "Invalid token" });
  }
}

// ✅ Create appointment (user)
router.post("/", auth, async (req, res) => {
  try {
    const appointment = new Appointment(req.body);
    await appointment.save();
    res.status(201).json({ message: "Appointment booked", appointment });
  } catch (err) {
    res.status(500).json({ message: "Booking failed", error: err.message });
  }
});

// ✅ Get appointments for a user
router.get("/user/:id", auth, async (req, res) => {
  try {
    const data = await Appointment.find({ user: req.params.id })
      .populate("doctor", "-password");
    res.json(data);
  } catch (err) {
    res.status(500).json({ message: "Unable to fetch appointments" });
  }
});

// ✅ Get appointments for a doctor
router.get("/doctor/:id", auth, async (req, res) => {
  try {
    const data = await Appointment.find({ doctor: req.params.id })
      .populate("user", "-password");
    res.json(data);
  } catch (err) {
    res.status(500).json({ message: "Unable to fetch appointments" });
  }
});

// ✅ Update appointment status (doctor approval or cancellation)
router.patch("/:id/status", auth, async (req, res) => {
  try {
    const { status } = req.body;

    if (!["Pending", "Confirmed", "Cancelled"].includes(status)) {
      return res.status(400).json({ message: "Invalid status value" });
    }

    const updated = await Appointment.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true }
    );

    if (!updated) {
      return res.status(404).json({ message: "Appointment not found" });
    }

    res.json({ message: `Appointment ${status}`, appointment: updated });
  } catch (err) {
    res.status(500).json({ message: "Failed to update appointment status", error: err.message });
  }
});

module.exports = router;
