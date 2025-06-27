const puppeteer = require("puppeteer"); // //נייבא את Puppeteer – ספרייה שמדמה דפדפן (headless Chrome).

//פונקציה המקבלת כתובת של שיר ב־ Tab4U (למשל: https://www.tab4u.com/tabs/songs/1234.html).
//מחזירה את פרטי השיר (כמו שם, אמן, מילים ואקורדים).
async function fetchTab4U(url) {
  const browser = await puppeteer.launch({
    headless: true,
    args: ["--no-sandbox", "--disable-setuid-sandbox"],
  });

  try {
    const page = await browser.newPage();
    await page.goto(url, { waitUntil: "networkidle0" });

    const song = await page.evaluate(() => {
      const title = document.querySelector("h1")?.innerText.trim() || "";
      const artist =
        document.querySelector(".artist_name")?.innerText.trim() || "";

      const rows = Array.from(document.querySelectorAll("table tr"));
      const sections = [];
      let currentSection = { type: "Verse", lines: [] };

      for (let i = 0; i < rows.length - 1; i++) {
        const current = rows[i].querySelector("td");
        const next = rows[i + 1].querySelector("td");

        if (!current || !next) continue;

        const currentClass = current.className;
        const nextClass = next.className;

        // English: chords_en + song
        // Hebrew: chords + song
        const isChordsLine =
          currentClass.includes("chords_en") || currentClass.includes("chords");
        const isLyricsLine = nextClass.includes("song");

        if (isChordsLine && isLyricsLine) {
          const chords = current.innerText.trim().replace(/\u00a0/g, " ");
          const lyrics = next.innerText.trim().replace(/\u00a0/g, " ");
          currentSection.lines.push({ chords, lyrics });
          i++;
        }
      }

      if (currentSection.lines.length) {
        sections.push(currentSection);
      }

      return { title, artist, sections };
    });

    await browser.close();
    return song;
  } catch (err) {
    await browser.close();
    throw err;
  }
}

module.exports = { fetchTab4U };
