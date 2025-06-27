// קובץ המודל של המשתמש (User.js) — כדי לבדוק איך השדות מוגדרים (username, instrument, role וכו').

const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  instrument: {
    type: String,
    required: true,
  },
  role: {
    type: String,
    enum: ["admin", "player"],
    default: "player",
  },
});

module.exports = mongoose.model("User", userSchema);
