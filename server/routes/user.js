const express = require("express");
const router = express.Router();
const jwt = require("jsonwebtoken");
const User = require("../models/User");

// Route להחזרת פרטי משתמש (כולל instrument ו-role)
router.get("/api/user-info", async (req, res) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader) {
      console.warn("🚫 אין authorization header");
      return res.status(401).json({ error: "No token provided" });
    }

    const token = authHeader.split(" ")[1];
    if (!token) {
      console.warn("🚫 אין token אחרי Bearer");
      return res.status(401).json({ error: "Token malformed" });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    if (!decoded.userId) {
      console.warn("🚫 decoded token לא מכיל userId");
      return res.status(401).json({ error: "Invalid token" });
    }

    const user = await User.findById(decoded.userId).select(
      "username instrument role"
    );

    if (!user) {
      console.warn("🚫 משתמש לא נמצא במסד הנתונים");
      return res.status(404).json({ error: "User not found" });
    }

    res.json({
      username: user.username,
      instrument: user.instrument,
      role: user.role,
    });
  } catch (error) {
    console.error("❌ שגיאה ב־/api/user-info:", error);
    res.status(500).json({ error: "Server error" });
  }
});

module.exports = router;
