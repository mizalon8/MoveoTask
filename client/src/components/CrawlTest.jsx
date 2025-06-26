import React, { useState } from "react";

function CrawlTest() {
  const [url, setUrl] = useState("");
  const [songData, setSongData] = useState(null);

  const handleFetch = async () => {
    try {
      const res = await fetch(`http://localhost:5000/api/crawl?url=${encodeURIComponent(url)}`);
      const data = await res.json();
      setSongData(data);
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div>
      <input
        placeholder="Enter Tab4U URL"
        value={url}
        onChange={(e) => setUrl(e.target.value)}
        style={{ width: "400px" }}
      />
      <button onClick={handleFetch}>Fetch Song</button>

      {songData && (
        <div>
          <h2>{songData.title}</h2>
          <h3>{songData.artist}</h3>
          <pre>{JSON.stringify(songData.sections, null, 2)}</pre>
        </div>
      )}
    </div>
  );
}

export default CrawlTest;
