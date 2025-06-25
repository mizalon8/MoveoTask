const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken"); // jsonwebtoken (JWT) מאפשר לנו ליצור טוקן לאחר התחברות, כדי לזהות את המשתמש בעתיד.
const User = require("../models/User");

// LOGIN
router.post("/signup", async (req, res) => {
  const { username, password, instrument } = req.body;

  if (!username || !password || !instrument) {
    return res.status(400).json({ message: "כל השדות דרושים" });
  }

  try {
    const existingUser = await User.findOne({ username });
    if (existingUser) {
      return res.status(400).json({ message: "שם משתמש כבר קיים" });
    }

    // we will encrypt the password with salt
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const newUser = new User({
      username,
      password: hashedPassword,
      instrument,
      role: "player", // ברירת מחדל לתפקיד 'player'
    });

    await newUser.save();

    res.status(201).json({ message: "משתמש נוצר בהצלחה" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "שגיאה בשרת" });
  }
});

// התחברות
router.post("/login", async (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).json({ message: "כל השדות דרושים" });
  }

  try {
    const user = await User.findOne({ username });
    if (!user) {
      return res.status(400).json({ message: "משתמש לא נמצא" });
    }

    // בדוק סיסמה
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: "סיסמה שגויה" });
    }

    // we we'll create JWT
    const payload = {
      userId: user._id,
      role: user.role,
    };

    const token = jwt.sign(payload, process.env.JWT_SECRET, {
      expiresIn: "1h",
    });

    res.json({ token, role: user.role, username: user.username });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "שגיאה בשרת" });
  }
});

module.exports = router;
