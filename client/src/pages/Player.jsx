import React, { useEffect, useState } from "react";

const Player = () => {
  const [username, setUsername] = useState("");

  useEffect(() => {
    const savedUsername = localStorage.getItem("username");
    setUsername(savedUsername || "User");
  }, []);

  return (
    <div style={{ textAlign: "center", marginTop: "50px" }}>
      <h1>🎵 Welcome, {username}!</h1>
    </div>
  );
};

export default Player;