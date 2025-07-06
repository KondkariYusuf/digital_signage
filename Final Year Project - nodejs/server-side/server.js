// server.js
const express = require('express');
const path = require('path');
const fs = require('fs');
const http = require('http');
const rangeParser = require('range-parser');
const cors = require('cors');

const app = express();
const port = 4000;

app.use(cors());
const videoFolder = path.join(__dirname, 'videos');

const jsonFilePath = path.join(__dirname, 'viewerData.json');
let currentVideo = null;

app.use(express.static(path.join(__dirname, 'public')));
// app.use('/videos', express.static(videoFolder)); // Serve videos statically
app.use('/videos', express.static(videoFolder, { fallthrough: false }));
app.use(express.json());


app.use((req, res, next) => {
  res.range = rangeParser;
  next();
});
// console.log(videoFolder);


let viewerData = [];

function setCurrentVideo(videoName) {
  currentVideo = videoName;
}


//Handling get requests

//Handling request at /videos-list to get the name of the vidoes 
app.get('/videos-list', (req, res) => {
  try {
    const files = fs.readdirSync(videoFolder);
    const videoFiles = files
      .filter(file => file.endsWith('.mp4'))
      .map(file => ({
        video_name: file,
        video_text: `Hey this is text for the ${file} video`
      }));

    console.log('Video Data:', videoFiles); // Log the video data
    res.json(videoFiles);
  } catch (error) {
    console.error('Error reading video files:', error);
    res.status(500).send('Internal Server Error');
  }
});


//Handling endpoint request at /videos/:filename
// app.get('/videos/:filename', (req, res) => {
//   const { filename } = req.params;
//   const filePath = path.join(videoFolder, filename);
//   console.log(filePath);
//   res.sendFile(filePath);
// });


app.get('/videos/:filename', (req, res) => {
  const { filename } = req.params;
  const filePath = path.join(videoFolder, filename);
  
  // Use res.sendFile with the range option
  res.sendFile(filePath, { acceptRanges: true }, (err) => {
    if (err) {
      console.error('Error sending file:', err);
      res.status(err.status).end();
    } else {
      console.log('File sent successfully');
    }
  });
});



//Handling root request
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

//handling request at /current-video-info
app.get('/current-video-info', (req, res) => {
  res.json({ currentVideo });
});


app.get('/download-videos', async (req, res) => {
  try {
    const response = await fetch('http://localhost:3000/videoData');
    const videoData = await response.json();

    // Loop through each video in the videoData
    for (const video of videoData.default) {
      const url = video.pathToDownload;
      const filename = video.name + '.mp4';
      const filePath = path.join(videoFolder, filename);

      const file = fs.createWriteStream(filePath);
      const request = http.get(url, (response) => {
        response.pipe(file);

        file.on('finish', () => {
          file.close(() => {
            console.log(`Video '${filename}' downloaded successfully.`);
          });
        });
      });

      request.on('error', (err) => {
        console.error('Error downloading video:', err);
      });
    }

    res.send('Videos downloaded successfully.');
  } catch (error) {
    console.error('Error downloading videos:', error);
    res.status(500).send('Internal Server Error');
  }
});


app.get('/videoDataSummary', (req, res) => {
  try {
    const jsonFilePath = path.join(__dirname, 'videoDataSummary.json');
    const videoSummaryData = fs.readFileSync(jsonFilePath, 'utf-8');
    const parsedData = JSON.parse(videoSummaryData);
    res.json(parsedData);
  } catch (error) {
    console.error('Error reading video summary data:', error);
    res.status(500).send('Internal Server Error');
  }
});





//Handling post requests

//Post reuqest for /update-viewer-data
// app.post('/update-viewer-data', (req, res) => {
//   const { viewerCount, startTime } = req.body;

//   // Handle viewer data update
//   if (currentVideo) {
//     console.log(`Viewer count for ${currentVideo}: ${viewerCount}`);
//     console.log(`Start time for ${currentVideo}: ${startTime}\n`);

//     // Update viewerData with the new data structure
//     viewerData.push({
//       video_name: currentVideo,
//       viewer_count: viewerCount,
//       timeAt: startTime
//     });

//     // Save viewer data to the JSON file
//     fs.writeFile(jsonFilePath, JSON.stringify(viewerData, null, 2), 'utf-8', (err) => {
//       if (err) {
//         console.error('Error saving viewer data to JSON file:', err);
//         res.status(500).send('Internal Server Error');
//       } else {
//         console.log('Viewer data saved to JSON file.');
//         res.status(200).send('Viewer data received and saved successfully');
//       }
//     });
    
//   } else {
//     console.log('No video is currently playing.');
//     res.status(400).send('No video is currently playing.');
//   }
// });




app.post('/update-viewer-data', (req, res) => {
  const { viewerCount, startTime } = req.body;

  if (!currentVideo) {
    console.log('No video is currently playing.');
    return res.status(400).send('No video is currently playing.');
  }

  // Update viewerData with the new data structure
  const updatedViewerData = {
    video_name: currentVideo,
    viewer_count: viewerCount,
    timeAt: startTime
  };

  // Save the updated data to viewerData.json
  viewerData.push(updatedViewerData);
  fs.writeFile(jsonFilePath, JSON.stringify(viewerData, null, 2), 'utf-8', (err) => {
    if (err) {
      console.error('Error saving viewer data to JSON file:', err);
      return res.status(500).send('Internal Server Error');
    }
    console.log('Viewer data saved to JSON file.');

    // Update videoDataSummary.json
    updateVideoDataSummary(updatedViewerData, (summaryError) => {
      if (summaryError) {
        return res.status(500).send('Internal Server Error');
      }
      res.status(200).send('Viewer data received and saved successfully');
    });
  });
});

// Function to update videoDataSummary.json
function updateVideoDataSummary(updatedViewerData, callback) {
  const summaryFilePath = path.join(__dirname, 'videoDataSummary.json');

  fs.readFile(summaryFilePath, 'utf-8', (readErr, summaryData) => {
    if (readErr) {
      console.error('Error reading videoDataSummary.json:', readErr);
      return callback(readErr);
    }

    let videoDataSummary = [];
    try {
      videoDataSummary = JSON.parse(summaryData);
    } catch (parseErr) {
      console.error('Error parsing videoDataSummary.json:', parseErr);
      return callback(parseErr);
    }

    const existingVideoIndex = videoDataSummary.findIndex(item => item.video_name === updatedViewerData.video_name);

    if (existingVideoIndex !== -1) {
      // Update existing entry
      videoDataSummary[existingVideoIndex].viewer_count += updatedViewerData.viewer_count;
    } else {
      // Add new entry
      videoDataSummary.push({
        video_name: updatedViewerData.video_name,
        viewer_count: updatedViewerData.viewer_count
      });
    }

    // Save updated data to videoDataSummary.json
    fs.writeFile(summaryFilePath, JSON.stringify(videoDataSummary, null, 2), 'utf-8', (writeErr) => {
      if (writeErr) {
        console.error('Error writing to videoDataSummary.json:', writeErr);
        return callback(writeErr);
      }
      console.log('Video data summary updated successfully.');
      callback(null);
    });
  });
}




//Post request to set the current playing (inorder to access the video on server side)
app.post('/set-current-video', (req, res) => {
  const { videoName } = req.body;

  setCurrentVideo(videoName);

  res.json({ success: true, message: 'Currently playing video updated successfully' });
});



//Listening the port
app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});


module.exports = {
  setCurrentVideo
};