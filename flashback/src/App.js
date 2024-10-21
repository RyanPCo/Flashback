import React, { useState } from "react";
import EXIF from "exif-js";
import "./App.css";

function App() {
  const [photoCount, setPhotoCount] = useState(0);
  const [selectedYear, setSelectedYear] = useState("2024");

  const handleYearChange = (event) => {
    setSelectedYear(event.target.value);
  };

  const processPhotos = (event) => {
    const files = event.target.files;

    // Initialize counters for each year
    let yearCounts = {
      2020: 0,
      2021: 0,
      2022: 0,
      2023: 0,
      2024: 0,
    };

    Array.from(files).forEach((file) => {
      // Use EXIF.js to get metadata
      EXIF.getData(file, function () {
        const dateTaken = EXIF.getTag(this, "DateTimeOriginal");
        if (dateTaken) {
          const yearTaken = dateTaken.split(":")[0]; // Extract the year
          if (yearCounts[yearTaken] !== undefined) {
            yearCounts[yearTaken] += 1;
          }
        }
      });
    });

    // Log the photo count for each year to the console
    setTimeout(() => {
      console.log("Photo counts by year:", yearCounts);
      if (yearCounts[selectedYear] !== undefined) {
        setPhotoCount(yearCounts[selectedYear]);
      }
    }, 500); // Adding delay to ensure EXIF data is loaded
  };

  return (
    <div className="container">
      <header>
        <h1>Flashback</h1>
        <p>Your year in photos.</p>
      </header>

      <main>
        <section id="upload-section">
          <h2>Upload Your Photos</h2>
          <input
            type="file"
            id="photoInput"
            multiple
            accept="image/jpeg, image/png, image/heic, image/heif"
            onChange={processPhotos}
          />
          <button id="uploadBtn" onClick={() => document.getElementById('photoInput').click()}>
            Upload Photos
          </button>
        </section>

        <section id="year-section">
          <h2>Select a Year</h2>
          <select value={selectedYear} onChange={handleYearChange}>
            <option value="2020">2020</option>
            <option value="2021">2021</option>
            <option value="2022">2022</option>
            <option value="2023">2023</option>
            <option value="2024">2024</option>
          </select>
        </section>

        <section id="stats-section">
          <h2>Your Stats</h2>
          <div id="stats">
            <p><strong>Photos taken in {selectedYear}:</strong> <span id="photoCount">{photoCount}</span></p>
          </div>
        </section>
      </main>

      <footer>
        <p>Flashback © 2024</p>
      </footer>
    </div>
  );
}

export default App;