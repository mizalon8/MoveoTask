import React, { useEffect, useState } from "react";
import { useLocation, useNavigate, Link } from "react-router-dom";
import socket from "../socket";
import axios from "axios";
import "../styles/Results.css";
import logo from "../assets/moveo.png";


const Results = () => {
  const { state } = useLocation();
  const { query } = state || {};
  const [results, setResults] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    if (!query) return;
    (async () => {
      try {
        const res = await fetch(`http://localhost:5000/search?query=${query}`);
        const data = await res.json();
        setResults(data);
      } catch (err) {
        console.error("Error fetching search results:", err);
      }
    })();
  }, [query]);

  const handleSongSelect = async (song) => {
    if (!song.url) {
      alert("Missing song URL.");
      return;
    }
    try {
      const res = await axios.get("http://localhost:5000/api/crawl", {
        params: { url: song.url },
      });
      const crawledSong = res.data;

      if (!crawledSong || !crawledSong.sections?.length) {
        alert("Failed to load song data from Tab4U.");
        return;
      }

      localStorage.setItem("currentSong", JSON.stringify(crawledSong));
      socket.emit("song-picked", crawledSong);
      navigate("/live", { state: { song: crawledSong } });
    } catch (err) {
      console.error("Error crawling song:", err);
      alert("Error loading song from Tab4U.");
    }
  };

  return (
  <div className="results-container">
    <img src={logo} alt="Moveo Logo" className="results-logo" />
    <div className="results-admin-link">
                  <span>Not sure?</span>
                  <Link to="/admin">
                    <button>Back</button>
                  </Link>
    </div>
    <h1 className="results-title">Search Results</h1>
    {results.length === 0 ? (
      <p className="results-empty">No songs found.</p>
    ) : (
      <ul className="results-list">
        {results.map((song, idx) => (
          <li
            key={idx}
            className="result-item"
            onClick={() => handleSongSelect(song)}
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
