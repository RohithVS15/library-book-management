const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const router = express.Router();
const mongoose = require("mongoose");
const User = require("../models/User");

// Register user
router.post("/register", async (req, res) => {
  try {
    const { username, password } = req.body;
    const hash = await bcrypt.hash(password, 10);
    await User.create({ username, password: hash });
    res.json({ message: "Registered Successfully" });
  } catch (err) {
    res.status(500).json({ error: "Registration failed" });
  }
});

// Login user
router.post("/login", async (req, res) => {
  try {
    const { username, password } = req.body;
    const user = await User.findOne({ username });
    if (!user) return res.json({ error: "User Not Found" });

    const match = await bcrypt.compare(password, user.password);
    if (!match) return res.json({ error: "Invalid Password" });

    const token = jwt.sign({ id: user._id }, "secretKey");
    res.json({ message: "Login Successful", token });
  } catch (err) {
    res.status(500).json({ error: "Login failed" });
  }
});

module.exports = router; // ✅ must export router
