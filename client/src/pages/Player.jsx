import React, { useEffect, useState } from "react";
import socket from "../socket";

const Player = () => {
  const [song, setSong] = useState(null);

  useEffect(() => {
    socket.on("song-picked", (newSong) => {
      setSong(newSong); // עדכון השיר ברגע שהאדמין בחר שיר
    });

    return () => {
      socket.off("song-picked");
    };
  }, []);

  return (
    <div style={{ textAlign: "center", marginTop: "50px" }}>
      {!song ? (
        <h1>Waiting for next song...</h1>
      ) : (
        <div>
          <h1>{song.title} - {song.artist}</h1>
          {/* כאן תוכל להוסיף את המילים והאקורדים */}
        </div>
      )}
    </div>
  );
};

export default Player;
