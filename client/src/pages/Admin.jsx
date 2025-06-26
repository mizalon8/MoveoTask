import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/Admin.css";
import logo from "../assets/moveo.png";

const Admin = () => {
  const [query, setQuery] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const stored = localStorage.getItem("currentSong");
    if (stored) {
      navigate("/live", { state: { song: JSON.parse(stored) } });
    }
  }, [navigate]);

  const handleSearchChange = (e) => {
    setQuery(e.target.value);
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    navigate("/results", { state: { query } });
  };

  return (
    <div className="admin-container">
      <img src={logo} alt="Moveo Logo" className="admin-logo" />
      <div className="admin-content">
        <h1 className="admin-title">Search for a Song</h1>
        <form className="admin-form" onSubmit={handleSearchSubmit}>
          <input
            type="text"
            className="admin-input"
            placeholder="Enter song name or artist"
            value={query}
            onChange={handleSearchChange}
            required
          />
          <button type="submit" className="admin-button">
            Search
          </button>
        </form>
      </div>
    </div>
  );
};

export default Admin;
