const express = require('express');
const multer = require('multer');
const pdfParse = require('pdf-parse');
const cors = require('cors');
const path = require('path');

const app = express();
app.use(cors()); // Add CORS middleware

const upload = multer({ storage: multer.memoryStorage() });

// Serve static files from the 'public' folder
app.use(express.static(path.join(__dirname, 'public')));

// Route for uploading and summarizing PDF
app.post('/upload', upload.single('file'), async (req, res) => {
  if (!req.file) {
    return res.status(400).json({ error: 'No file uploaded' });
  }

  try {
    const data = await pdfParse(req.file.buffer);
    const summary = data.text.slice(0, 500); // Truncate to 500 characters for brevity
    res.json({ text: summary });
  } catch (err) {
    res.status(500).json({ error: 'Error processing file' });
  }
});

// Default route for '/'
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Fallback route for undefined paths
app.get('*', (req, res) => {
  res.status(404).send('404: Page Not Found');
});

const PORT = 3000;
app.listen(PORT, () => console.log(`Server is running on http://localhost:${PORT}`));
