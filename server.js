const express = require('express');
const fs = require('fs');
const path = require('path');
const app = express();
const port = 3000;

// Middleware to parse JSON and urlencoded data
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve static files from 'public' directory
app.use(express.static('public'));

app.get('/specs', (req, res) => {
  fs.readdir(path.join(__dirname, 'specs'), (err, files) => {
    if (err) {
      res.status(500).send('Error reading spec files');
      return;
    }
    res.json(files.filter(file => file.endsWith('.csv')));
  });
});

app.get('/getSpecFile/:filename', (req, res) => {
  const { filename } = req.params;
  const filepath = path.join(__dirname, 'specs', filename);

  fs.readFile(filepath, 'utf8', (err, data) => {
      if (err) {
          res.status(500).send('Error reading the spec file');
          return;
      }
      res.send(data);
  });
});

const logsDir = path.join(__dirname, 'logs');
if (!fs.existsSync(logsDir)) {
  fs.mkdirSync(logsDir);
}
let logQueue = [];
let isWriting = false;



app.post('/logEvent', (req, res) => {
  const { internalId, testId, eventType, lineNumber, eventArgs } = req.body;
  const timestamp = new Date();
  const logLine = `${timestamp.toISOString()},${internalId},${testId},${lineNumber},${eventType},${eventArgs}\n`; // Include line number in the log entry
  const logFilePath = path.join(logsDir, `log_${timestamp.getFullYear()}_${String(timestamp.getMonth() + 1).padStart(2, '0')}_${String(timestamp.getDate()).padStart(2, '0')}.csv`);

  logQueue.push({ logLine, logFilePath });
  res.status(200).send('Event received');
  processQueue();
});

function processQueue() {
  if (isWriting || logQueue.length === 0) {
    return;
  }
  isWriting = true;
  const { logLine, logFilePath } = logQueue.shift();

  fs.appendFile(logFilePath, logLine, (err) => {
    isWriting = false;
    if (err) {
      console.error('Error writing to log file:', err);
      return;
    }
    if (logQueue.length > 0) {
      processQueue();
    }
  });
}


app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});





