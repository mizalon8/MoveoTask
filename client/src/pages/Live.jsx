import React, { useEffect, useState, useRef } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import socket from "../socket";

// פונקציה שמעבדת את השיר לתצוגה, עם או בלי אקורדים
const formatSongForDisplay = (song, showChords = true) => {
  if (!song.sections) return "";
  return song.sections
    .map((section) => {
      const lines = section.lines
        .map((line) => {
          // אם צריך להראות אקורדים - מציגים אותם בצבע אפור
          const chordsLine = showChords
            ? `<span style="color:#999">${line.chords || ""}</span><br/>`
            : "";
          return `${chordsLine}${line.lyrics}`;
        })
        .join("<br/><br/>");

      return `<strong>🎵 ${section.type.toUpperCase()}</strong><br/><br/>${lines}`;
    })
    .join("<br/><br/><br/>");
};

const Live = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const scrollRef = useRef(null);

  // state ל-role ול-instrument של המשתמש
  const [userRole, setUserRole] = useState("");
  const [userInstrument, setUserInstrument] = useState(""); // הוספנו כאן state ל-instrument
  const [autoScroll, setAutoScroll] = useState(false);

  // state לשיר הנבחר - נטען מ-localStorage או מ-location state
  const [song, setSong] = useState(() => {
    const stored = localStorage.getItem("currentSong");
    return location.state?.song || (stored ? JSON.parse(stored) : null);
  });

  // useEffect שמושך את פרטי המשתמש מהשרת (כולל instrument)
  useEffect(() => {
    async function fetchUserInfo() {
      try {
        const token = sessionStorage.getItem("token");
        if (!token) {
          console.warn("No token found, skipping user info fetch");
          return;
        }
        const res = await fetch("http://localhost:5000/api/user-info", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        if (!res.ok) throw new Error("Failed to fetch user info");
        const data = await res.json();
        setUserRole(data.role || "");
        setUserInstrument(data.instrument || "");
      } catch (err) {
        console.error(err);
      }
    }
    fetchUserInfo();
  }, []);

  useEffect(() => {
  const storedSong = localStorage.getItem("currentSong");
  if (!location.state?.song && !storedSong) {
    // אין שיר - נחזיר את המשתמש אחורה לפי התפקיד
    if (userRole === "admin") {
      navigate("/admin");
    } else {
      navigate("/player");
    }
  }
}, [userRole, navigate, location.state]);

useEffect(() => {
  const storedSong = localStorage.getItem("currentSong");
  if (!location.state?.song && !storedSong) {
    // אין שיר - נחזיר את המשתמש אחורה לפי התפקיד
    if (userRole === "admin") {
      navigate("/admin");
    } else {
      navigate("/player");
    }
  }
}, [userRole, navigate, location.state]);


  // Scroll אוטומטי כאשר autoScroll דולק
  useEffect(() => {
    let scrollInterval;
    if (autoScroll) {
      scrollInterval = setInterval(() => {
        if (scrollRef.current) {
          scrollRef.current.scrollBy({ top: 1, behavior: "smooth" });
        }
      }, 50);
    }
    return () => clearInterval(scrollInterval);
  }, [autoScroll]);

  // האזנה לאירוע song-picked שמגיע מהשרת (דרך socket.io)
  useEffect(() => {
    socket.on("song-picked", (pickedSong) => {
      localStorage.setItem("currentSong", JSON.stringify(pickedSong)); // שמירת השיר ב-localStorage
      setSong(pickedSong);
    });
    return () => socket.off("song-picked");
  }, []);

  // האזנה לאירוע quit-session שמחזיר את המשתמש לעמוד המתאים
  useEffect(() => {
    socket.on("quit-session", () => {
      localStorage.removeItem("currentSong");
      if (userRole === "admin") {
        navigate("/admin");
      } else {
        navigate("/player");
      }
    });
    return () => socket.off("quit-session");
  }, [userRole, navigate]);

  if (!song) {
    return (
      <div style={{ textAlign: "center", marginTop: "50px", color: "#fff" }}>
        Waiting for song...
      </div>
    );
  }

 return (
  <div
    style={{
      backgroundColor: "#111",
      color: "#fff",
      minHeight: "100vh",
      padding: "0",
      margin: "0",
      overflow: "hidden", // מונע גלילה כפולה
    }}
  >
    {/* כפתורים למעלה */}
    <div
      style={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        padding: "20px 30px",
        borderBottom: "1px solid #333",
        position: "sticky",
        top: 0,
        backgroundColor: "#111",
        zIndex: 10,
      }}
    >
      <button
        onClick={() => setAutoScroll(!autoScroll)}
        style={{
          backgroundColor: "#222",
          color: "#fff",
          border: "1px solid #555",
          borderRadius: "8px",
          padding: "10px 20px",
          cursor: "pointer",
          fontSize: "16px",
          transition: "background-color 0.3s",
        }}
        onMouseOver={(e) => (e.target.style.backgroundColor = "#333")}
        onMouseOut={(e) => (e.target.style.backgroundColor = "#222")}
      >
        {autoScroll ? "Stop Scroll" : "Start Scroll"}
      </button>

      {userRole === "admin" && (
        <button
          onClick={() => socket.emit("quit-session")}
          style={{
            backgroundColor: "#8B0000",
            color: "#fff",
            border: "none",
            borderRadius: "8px",
            padding: "10px 20px",
            cursor: "pointer",
            fontSize: "16px",
            transition: "background-color 0.3s",
          }}
          onMouseOver={(e) => (e.target.style.backgroundColor = "#a30000")}
          onMouseOut={(e) => (e.target.style.backgroundColor = "#8B0000")}
        >
          Quit
        </button>
      )}
    </div>

    {/* תוכן השיר עם גלילה פנימית אחת בלבד */}
    <div
      ref={scrollRef}
      style={{
        padding: "30px",
        maxHeight: "calc(100vh - 80px)", // משאיר מקום לכפתורים
        overflowY: "auto",
        fontSize: "20px",
        lineHeight: "1.8",
      }}
    >
      <h2 style={{ textAlign: "center", direction: "rtl"}}>{song.title}</h2> 

      <div
        style={{ marginTop: "30px" }}
        dangerouslySetInnerHTML={{
          __html: formatSongForDisplay(song, userInstrument !== "vocals"),
        }}
      />
    </div>
  </div>
);

};

export default Live;
