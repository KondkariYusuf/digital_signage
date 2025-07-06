const express = require('express');
const multer = require('multer');
const fs = require('fs');
const path = require('path');
const cors = require('cors')

const axios = require('axios');;


const app = express();
const port = 3000;
app.use(cors());

const videoFolder = path.join(__dirname, 'public/uploads')
// Set up multer for handling file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'public/uploads/');
  },
  filename: (req, file, cb) => {
    // Use the provided video title as the filename
    const videoTitle = req.body.videoTitle || 'untitled';
    // const filename = `${videoTitle.replace(/\s+/g, '_')}-${Date.now()}${path.extname(file.originalname)}`;
    const filename = `${videoTitle.replace(/\s+/g, '_')}${path.extname(file.originalname)}`;
    cb(null, filename);
  },
});

const upload = multer({ storage });

// Serve static files from the public directory
app.use(express.static(path.join(__dirname, 'public')));


// Serve videoData.json
app.get('/videoData', (req, res) => {
  const dataPath = path.join(__dirname, 'public', 'videoData.json');
  try {
    const data = fs.readFileSync(dataPath, 'utf-8');

    res.json(JSON.parse(data));
  } catch (error) {
    console.error('Error reading videoData.json:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});


// app.get('/videoData', async (req, res) => {
//   const dataPath = path.join(__dirname, 'public', 'videoData.json');
//   try {
//     const data = fs.readFileSync(dataPath, 'utf-8');
//     res.json(JSON.parse(data));

//     // Trigger the /download-videos endpoint on the server running on port 4000
//     await axios.get('http://localhost:4000/download-videos');
//   } catch (error) {
//     console.error('Error reading videoData.json:', error);
//     res.status(500).json({ error: 'Internal Server Error' });
//   }
// });




app.get('/videos/:filename', (req, res) => {
  const { filename } = req.params;
  const filePath = path.join(videoFolder, filename);
  console.log(filePath);
  res.sendFile(filePath);
});


// Handle video upload
app.post('/upload', upload.single('videoFile'), (req, res) => {
  const { file } = req;
  const { videoTitle, videoDescription } = req.body;

  const downloadVideosUrl = 'http://localhost:4000/download-videos';

  // Make a GET request to the specified URL
  axios.get(downloadVideosUrl)
    .then(response => {
      console.log('Request to download-videos succeeded:', response.data);
    })
    .catch(error => {
      console.error('Error making request to download-videos:', error.message);
    });

  if (!file) {
    return res.status(400).json({ error: 'No video file provided' });
  }

  // Store video information in a JSON file
  const videoData = {
    name: videoTitle || 'Untitled Video',
    path: `uploads/${file.filename}`,
    pathToDownload: `http://localhost:3000/videos/${file.filename}`, // Store the path relative to the public directory
    description: videoDescription || '',
  };

  const clientID = req.query.clientID || 'default';

  try {
    // Read existing data from the JSON file using an absolute path
    const dataPath = path.join(__dirname, 'public', 'videoData.json');
    let clientData = {};

    try {
      const data = fs.readFileSync(dataPath, 'utf-8');
      clientData = JSON.parse(data);
    } catch (error) {
      console.error('Error reading videoData.json:', error);
    }

    // Log client data before update
    console.log('Client Data Before Update:', clientData);

    // Create an array for the client if it doesn't exist
    if (!clientData[clientID]) {
      clientData[clientID] = [];
    }

    // Add the videoData to the client's array
    clientData[clientID].push(videoData);

    // Write the updated data back to the JSON file using an absolute path
    fs.writeFileSync(dataPath, JSON.stringify(clientData, null, 2));

    // Log client data after update
    console.log('Client Data After Update:', clientData);

    console.log('Data Successfully Written to File:', clientData);

    // res.json({ success: true, message: 'Video uploaded successfully' });
    res.redirect('/index.html')
  } catch (error) {
    console.error('Error reading/writing videoData.json:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});


// const apiUrl = 'http://localhost:3000/videoInfo';

// fetch(apiUrl)
//   .then(response => response.json())
//   .then(videoInfo => {
//     // Process the videoInfo, e.g., download videos
//     console.log(videoInfo);
//   })
//   .catch(error => console.error('Error fetching videoInfo:', error));

// const apiUrl = 'http://localhost:3000/videoInfo';

// axios.get(apiUrl)
//   .then(response => {
//     // Process the response data, e.g., download videos
//     console.log(response.data);
//   })
//   .catch(error => console.error('Error fetching videoInfo:', error.message));




// Serve uploaded videos
app.use('/uploads', express.static('public/uploads'));

app.listen(port, () => {
  console.log(`Server listening at http://localhost:${port}`);
});
