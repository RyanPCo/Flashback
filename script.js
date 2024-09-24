document.getElementById('uploadBtn').addEventListener('click', processPhotos);

function processPhotos() {
  const files = document.getElementById('photoInput').files;
  if (files.length === 0) {
    console.log("No files selected.");
    return;
  } else {
    console.log(`${files.length} file(s) uploaded.`);
  }

  // Loop through all selected files
  Array.from(files).forEach(file => {
    EXIF.getData(file, function() {
      const allMetaData = EXIF.getAllTags(this);

      // Log file name and formatted metadata
      console.log(`Metadata for: ${file.name}`);
      printMetaData(allMetaData);
    });
  });
}

// Function to print metadata in a readable format
function printMetaData(metaData) {
  if (Object.keys(metaData).length === 0) {
    console.log("No metadata found.");
    return;
  }

  Object.entries(metaData).forEach(([key, value]) => {
    console.log(`${key}: ${value}`);
  });

  console.log(''); // Add an empty line for better readability between files
}