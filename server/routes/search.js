const express = require("express");
const router = express.Router();
const fs = require("fs");
const path = require("path");

// טוען את קובץ השירים
const songs = JSON.parse(
  fs.readFileSync(path.join(__dirname, "../data/songs.json"), "utf8")
);

// חיפוש שירים
router.get("/search", (req, res) => {
  const query = req.query.query?.toLowerCase();

  if (!query) {
    return res.json([]);
  }

  const results = songs.filter(
    (song) =>
      song.title.toLowerCase().includes(query) ||
      song.artist.toLowerCase().includes(query)
  );
  res.json(results);
});

module.exports = router;
