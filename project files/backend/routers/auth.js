const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/User");
const Doctor = require("../models/Doctor");

const router = express.Router();

// Register (user or doctor)
router.post("/register", async (req, res) => {
  const { role } = req.body;

  try {
    const Model = role === "doctor" ? Doctor : User;
    const existing = await Model.findOne({ email: req.body.email });
    if (existing) return res.status(400).json({ message: "Email already registered" });

    const hashedPassword = await bcrypt.hash(req.body.password, 10);
    const newEntry = new Model({ ...req.body, password: hashedPassword });
    await newEntry.save();
    res.status(201).json({ message: `${role} registered successfully` });
  } catch (err) {
    res.status(500).json({ message: "Registration failed", error: err.message });
  }
});

// Login
router.post("/login", async (req, res) => {
  const { email, password, role } = req.body;
  try {
    const Model = role === "doctor" ? Doctor : role === "admin" ? User : User;
    const user = await Model.findOne({ email });
    if (!user) return res.status(404).json({ message: "Email not found" });

    const match = await bcrypt.compare(password, user.password);
    if (!match) return res.status(401).json({ message: "Invalid credentials" });

    if (user.role !== role) return res.status(403).json({ message: "Role mismatch" });

    const token = jwt.sign({ id: user._id, role: user.role }, "SECRET", { expiresIn: "30m" });
    res.json({ token, user });
  } catch (err) {
    res.status(500).json({ message: "Login failed", error: err.message });
  }
});

module.exports = router;
