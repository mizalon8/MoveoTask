import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const Admin = () => {
  const [query, setQuery] = useState("");
  const navigate = useNavigate();

  const handleSearchChange = (e) => {
    setQuery(e.target.value);
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    // כאן נעבור לעמוד תוצאות החיפוש (Results)
    navigate("/results", { state: { query } });
  };

  return (
    <div style={{ textAlign: "center", marginTop: "50px" }}>
      <h1>Search any song...</h1>
      <form onSubmit={handleSearchSubmit}>
        <input
          type="text"
          placeholder="Enter song name or artist"
          value={query}
          onChange={handleSearchChange}
          required
        />
        <button type="submit">Search</button>
      </form>
    </div>
  );
};

export default Admin;
