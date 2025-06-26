const express = require("express");
const cors = require("cors");
const http = require("http");
const { Server } = require("socket.io");
const mongoose = require("mongoose");
const userRoutes = require("./routes/user");
const { fetchTab4U } = require("./utils/crawler");

require("dotenv").config();

const authRoutes = require("./routes/auth.js");
const searchRoutes = require("./routes/search.js");

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "http://localhost:3000",
    methods: ["GET", "POST"],
  },
});

// Middlewares
app.use(cors());
app.use(express.json());

// Routes
app.use(authRoutes);
app.use(searchRoutes);
app.use(userRoutes);

app.get("/api/crawl", async (req, res) => {
  const { url } = req.query;
  if (!url) return res.status(400).json({ error: "Missing URL parameter" });

  try {
    const song = await fetchTab4U(url);

    res.json(song);
  } catch (err) {
    console.error("Crawler error:", err.message);
    res.status(500).json({ error: "Failed to crawl song" });
  }
});

// Socket.IO
io.on("connection", (socket) => {
  console.log("🟢 New client connected:", socket.id);

  // שלח לכל המשתמשים שיצטרף משתמש חדש
  io.emit("user-connected", { id: socket.id });

  socket.on("song-picked", (song) => {
    console.log("Server broadcasting song-picked:", song); //בדיקההה
    io.emit("song-picked", song); // שלח את השיר לכל השחקנים
  });

  socket.on("disconnect", () => {
    console.log("🔴 Client disconnected:", socket.id);
    // שלח לכל המשתמשים שיצא משתמש
    io.emit("user-disconnected", { id: socket.id });
  });

  socket.on("quit-session", () => {
    console.log("⚠️ Admin quit session");
    io.emit("quit-session");
  });
});

// DB connect
mongoose
  .connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("✅ Connected to MongoDB"))
  .catch((err) => console.error("❌ Mongo Error:", err));

// Start server
const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
