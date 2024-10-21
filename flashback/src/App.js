import React, { useState } from "react";
import "./App.css";

function App() {
  const [photoCount, setPhotoCount] = useState(0);
  
  const processPhotos = (event) => {
    const files = event.target.files;
    setPhotoCount(files.length);

    // Add EXIF.js handling here if you want to extract metadata.
    Array.from(files).forEach(file => {
      console.log(`File uploaded: ${file.name}`);
    });
  };

  return (
    <div className="container">
      <header>
        <h1>2024 Flashback</h1>
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
          <button id="uploadBtn">Upload Photos</button>
        </section>

        <section id="stats-section">
          <h2>Your Stats</h2>
          <div id="stats">
            <p><strong>Photos taken in the last year:</strong> <span id="photoCount">{photoCount}</span></p>
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