const express = require("express");
const Doctor = require("../models/Doctor");
const router = express.Router();
const jwt = require("jsonwebtoken");

// Get all doctors (for users)
router.get("/", async (req, res) => {
  try {
    const doctors = await Doctor.find({}, "-password");
    res.json(doctors);
  } catch (err) {
    res.status(500).json({ message: "Error loading doctors" });
  }
});

module.exports = router;
