const express = require("express");
const cors = require("cors");
const http = require("http");
const { Server } = require("socket.io");
const mongoose = require("mongoose");
require("dotenv").config();

const authRoutes = require("./routes/auth.js");

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

// Socket.IO
io.on("connection", (socket) => {
  console.log("🟢 New client connected:", socket.id);

  // שלח לכל המשתמשים שיצטרף משתמש חדש
  io.emit("user-connected", { id: socket.id });

  socket.on("disconnect", () => {
    console.log("🔴 Client disconnected:", socket.id);
    // שלח לכל המשתמשים שיצא משתמש
    io.emit("user-disconnected", { id: socket.id });
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
