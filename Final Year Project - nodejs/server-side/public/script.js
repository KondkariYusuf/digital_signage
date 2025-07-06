// public/script.js
document.addEventListener('DOMContentLoaded', async function () {
  const videoPlayer = document.getElementById('videoPlayer');
  // const overlayText = document.getElementById('overlayText');
  const overlayText = document.getElementById('marqueeText');
  let currentVideoIndex = 0;

  // Fetch the list of video files
  
  
  async function playNextVideo()  {
    const response = await fetch('http://localhost:4000/videos-list');
    const videoFiles = await response.json();

    // const response2 = await fetch('http://localhost:4000/download-videos');

    // console.log(response2.json());

    if (currentVideoIndex >= videoFiles.length) {
      // Loop back to the first video when all videos have played
      currentVideoIndex = 0;
    }

    // const nextVideo = (videoFiles[currentVideoIndex % videoFiles.length]);
    const nextVideo = (videoFiles[currentVideoIndex]);
    console.log(nextVideo);
    // videoPlayer.src = `http://localhost:3000/videos/${nextVideo.video_name}`;
    // videoPlayer.pause();
    // videoPlayer.src = '';
    videoPlayer.src = `http://localhost:4000/videos/${nextVideo.video_name}`;
    videoPlayer.onerror = (error) => {
      console.error('Error loading video:', error);
    };


    if(nextVideo.video_text == "") {
      overlayText.style.display = 'none'
    } else {
      overlayText.style.display = 'block'
      overlayText.textContent = `${nextVideo.video_text}`
    }

    videoPlayer.focus();

    

    // Set the currently playing video on the server
    fetch('http://localhost:4000/set-current-video', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ videoName: nextVideo.video_name })
    })
      .then(response => response.json())
      .then(data => console.log(data))
      .catch(error => console.error('Error setting current video:', error));

    // Check if user interaction is required for autoplay
    const playPromise = videoPlayer.play();

    if (playPromise !== undefined) {
      playPromise.then(_ => {}).catch(error => {
        console.error('Autoplay failed:', error);
        // Handle autoplay failure (e.g., show play button)
      });
    }

    currentVideoIndex++;


  }


  videoPlayer.onerror = (error) => {
    console.error('Error loading video:', error);
  
    // Log additional details
    console.log('Current video index:', currentVideoIndex);
    console.log('Current video:', videoFiles[currentVideoIndex]);
  };

  
  
  // Event listener to play the next video when the current one ends

  videoPlayer.addEventListener('ended',  playNextVideo);

  // Initial video play
  playNextVideo();

  // Request fullscreen when the document is clicked
  document.addEventListener('click', () => {

    console.log('Hey click occur');


    
    if (document.fullscreenEnabled) {
      document.documentElement.requestFullscreen().catch((err) => {
        console.error('Error attempting to enable fullscreen:', err.message);
      });
    }
  });
});
