import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import socket from "../socket";

const Results = () => {
  const { state } = useLocation();
  const { query } = state || {};
  const [results, setResults] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchResults = async () => {
      try {
        const res = await fetch(`http://localhost:5000/search?query=${query}`);
        const data = await res.json();
        setResults(data);
      } catch (err) {
        console.error("Error fetching search results:", err);
      }
    };

    if (query) {
      fetchResults();
    }
  }, [query]);

  // ✅ שינוי 1: שומר את השיר ב-localStorage ומשדר לכולם
  const handleSongSelect = (song) => {
    localStorage.setItem("currentSong", JSON.stringify(song)); // 🔹 שמירה מקומית
    socket.emit("song-picked", song); // 🔹 שידור לכל השחקנים
    navigate("/live"); // 🔹 נווט מיידית לאדמין
  };

  return (
    <div style={{ textAlign: "center", marginTop: "50px" }}>
      <h1>Search Results</h1>
      {results.length === 0 ? (
        <p>No songs found.</p>
      ) : (
        <ul style={{ listStyle: "none", padding: 0 }}>
          {results.map((song, index) => (
            <li
              key={index}
              onClick={() => handleSongSelect(song)}
              style={{
                cursor: "pointer",
                padding: "10px",
                borderBottom: "1px solid #ccc",
              }}
            >
              {song.title} - {song.artist}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default Results;
