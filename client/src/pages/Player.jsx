import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import socket from "../socket";

const Player = () => {
  const navigate = useNavigate();

  useEffect(() => {
    // בודק אם כבר קיים שיר ב־localStorage (למקרה שהשחקן נכנס אחרי שהשיר נבחר)
    const stored = localStorage.getItem("currentSong");
    if (stored) {
      navigate("/live", { state: { song: JSON.parse(stored) } });
    }

    // מאזין לאירוע מהשרת כאשר האדמין בוחר שיר חדש
    socket.on("song-picked", (newSong) => {
      localStorage.setItem("currentSong", JSON.stringify(newSong));
      navigate("/live", { state: { song: newSong } });
    });

    return () => {
      socket.off("song-picked");
    };
  }, [navigate]);

  return (
  <div
    style={{
      textAlign: "center",
      marginTop: "50px",
      color: "#111",
      height: "100vh",
    }}
  >
    <h1>Waiting for next song...</h1>
  </div>
);
};

export default Player;
