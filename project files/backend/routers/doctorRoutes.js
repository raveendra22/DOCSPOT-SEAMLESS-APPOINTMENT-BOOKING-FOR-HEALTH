const express = require("express");
const router = express.Router();
const Doctor = require("../models/Doctor");
const verifyToken = require("../middleware/authMiddleware.js");

// Get all doctors
router.get("/", verifyToken, async (req, res) => {
  try {
    const doctors = await Doctor.find().select("-password");
    res.status(200).json(doctors);
  } catch (err) {
    console.error("Error fetching doctors:", err);
    res.status(500).json({ message: "Server error while fetching doctors" });
  }
});

// ✅ Get single doctor by ID
router.get("/:id", verifyToken, async (req, res) => {
  const doctorId = req.params.id;

  if (!doctorId || doctorId.length !== 24) {
    return res.status(400).json({ message: "Invalid doctor ID" });
  }

  try {
    const doctor = await Doctor.findById(doctorId).select("-password");
    if (!doctor) {
      return res.status(404).json({ message: "Doctor not found" });
    }

    res.status(200).json(doctor);
  } catch (err) {
    console.error("Error fetching doctor by ID:", err);
    res.status(500).json({ message: "Server error while fetching doctor" });
  }
});

module.exports = router;
