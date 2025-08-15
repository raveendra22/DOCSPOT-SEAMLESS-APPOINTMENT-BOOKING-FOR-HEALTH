const express = require("express");
const router = express.Router();

const verifyToken = require("../middleware/authMiddleware"); // ✅ matches file name
const User = require("../models/User");                      // ✅ matches User.js

router.get("/me", verifyToken, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select("-password");
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    res.json(user);
  } catch (err) {
    console.error("Error in /me route:", err.message);
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;
