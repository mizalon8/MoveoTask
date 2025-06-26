import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import socket from "../socket";
import "../styles/Player.css";
import logo from "../assets/moveo.png";

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
    <div className="player-container">
      <img src={logo} alt="Moveo Logo" className="player-logo" />
      <div className="player-content">
        <h2 className="player-text">Waiting for next song...</h2>
        <div className="bouncing-dots">
          <div className="dot"></div>
          <div className="dot"></div>
          <div className="dot"></div>
        </div>
      </div>
    </div>
  );
};

export default Player;
