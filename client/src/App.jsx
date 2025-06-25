import React, { useEffect, useRef } from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Signup from "./pages/Signup";
import Login from "./pages/Login";
import Admin from "./pages/Admin";
import Player from "./pages/Player";
import { io } from "socket.io-client";

export default function App() {
  const socketRef = useRef(null);

  useEffect(() => {
    // יוצרים את הסוקט בתוך useEffect
    socketRef.current = io("http://localhost:5000", {
      transports: ["websocket"], // נשתמש ב-WebSocket בלבד
    });

    const socket = socketRef.current;

    socket.on("connect", () => {
      console.log("🟢 Connected with socket id:", socket.id);
    });

    socket.on("user-connected", (data) => {
      console.log("New user connected:", data.id);
    });

    socket.on("user-disconnected", (data) => {
      console.log("User disconnected:", data.id);
    });

    socket.on("disconnect", () => {
      console.log("🔴 Disconnected from server");
    });

    socket.on("connect_error", (err) => {
      console.error("❌ Socket connection error:", err.message);
    });

    return () => {
      socket.disconnect(); // נתק את הסוקט כשעוזבים את הקומפוננטה
    };
  }, []);

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Navigate to="/signup" />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/login" element={<Login />} />
        <Route path="/admin" element={<Admin />} />
        <Route path="/player" element={<Player />} />
      </Routes>
    </BrowserRouter>
  );
}
