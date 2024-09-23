document.getElementById('uploadBtn').addEventListener('click', processPhotos);

function processPhotos() {
  const files = document.getElementById('photoInput').files;
  if (files.length === 0) {
    console.log("No files selected.");
    return;
  }

  const currentYear = new Date().getFullYear();
  let photoCount = 0;
  const locations = {};

  const promises = Array.from(files).map(file => {
    return new Promise((resolve, reject) => {
      console.log(`Processing file: ${file.name}, type: ${file.type}`);

      // Check if the file is a HEIC file
      if (file.type === 'image/heic' || file.type === 'image/heif') {
        console.log("HEIC file detected, converting...");
        heic2any({ blob: file, toType: "image/jpeg" })
          .then(convertedBlob => {
            console.log("HEIC to JPEG conversion successful.");
            processImage(convertedBlob, resolve);
          })
          .catch(err => {
            console.error("HEIC to JPEG conversion failed:", err);
            resolve({ date: null, location: null });
          });
      } else {
        console.log("Non-HEIC file detected, processing directly.");
        // If it's a JPEG/PNG or other supported format, process it directly
        processImage(file, resolve);
      }
    });
  });

  // Once all EXIF data is extracted, process the results
  Promise.all(promises).then(results => {
    results.forEach(({ date, location }) => {
      if (date && date.getFullYear() === currentYear) {
        photoCount++;
      }

      const loc = location || 'Unknown';
      if (locations[loc]) {
        locations[loc]++;
      } else {
        locations[loc] = 1;
      }
    });

    document.getElementById('photoCount').textContent = photoCount;
    const mostPopularLocation = Object.keys(locations).reduce((a, b) => locations[a] > locations[b] ? a : b, 'Unknown');
    document.getElementById('popularLocation').textContent = mostPopularLocation;

    console.log("Photo count:", photoCount);
    console.log("Most popular location:", mostPopularLocation);
  });
}

// Function to process an image (either converted or original)
function processImage(file, resolve) {
  const reader = new FileReader();
  reader.onload = function (event) {
    const image = new Image();
    image.src = event.target.result;

    image.onload = function() {
      EXIF.getData(image, function() {
        const allTags = EXIF.getAllTags(this);
        if (allTags) {
          console.log("EXIF data detected for this photo.");
          console.log("All EXIF tags: ", allTags); // Log all EXIF tags
        } else {
          console.log("No EXIF data detected for this photo.");
          resolve({ date: null, location: null });
          return;
        }

        // Check for possible date-related tags
        const dateTaken = EXIF.getTag(this, "DateTimeOriginal") || EXIF.getTag(this, "DateTime") || EXIF.getTag(this, "DateTimeDigitized");

        if (dateTaken) {
          console.log(`Date tag detected: ${dateTaken}`);
        } else {
          console.log("No date-related tag detected.");
        }

        const gpsLat = EXIF.getTag(this, "GPSLatitude");
        const gpsLng = EXIF.getTag(this, "GPSLongitude");

        if (gpsLat && gpsLng) {
          console.log("GPS tags detected.");
        } else {
          console.log("GPS tags not detected.");
        }

        // Convert GPS coordinates to a readable location if available
        const location = gpsLat && gpsLng ? convertGPSToLocation(gpsLat, gpsLng) : null;

        // Format date from EXIF data if available
        const date = dateTaken ? new Date(dateTaken.replace(/:/g, '-').replace(' ', 'T')) : null;

        // Log date and location to console
        if (date) {
          console.log(`Date taken: ${date}`);
        } else {
          console.log("Date taken: None detected");
        }

        if (location) {
          console.log(`Location: ${location}`);
        } else {
          console.log("Location: None detected");
        }

        resolve({ date, location });
      });
    };
  };
  reader.readAsDataURL(file);
}

// Function to convert GPS coordinates from EXIF to a readable location
function convertGPSToLocation(gpsLat, gpsLng) {
  const latDegree = gpsLat[0];
  const latMinute = gpsLat[1];
  const latSecond = gpsLat[2];
  const latRef = EXIF.getTag(this, "GPSLatitudeRef") || "N";

  const lngDegree = gpsLng[0];
  const lngMinute = gpsLng[1];
  const lngSecond = gpsLng[2];
  const lngRef = EXIF.getTag(this, "GPSLongitudeRef") || "W";

  let latitude = latDegree + (latMinute / 60) + (latSecond / 3600);
  let longitude = lngDegree + (lngMinute / 60) + (lngSecond / 3600);

  if (latRef === "S") latitude = -latitude;
  if (lngRef === "W") longitude = -longitude;

  return `${latitude.toFixed(2)}, ${longitude.toFixed(2)}`;
}