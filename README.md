📺 Digital Signage System using Raspberry Pi
📝 Project Overview
This project is an IoT-powered digital signage system built using Raspberry Pi, designed to display videos remotely and dynamically, with additional features like real-time view counting using a camera module. The system is ideal for advertising, announcements, and informational displays in public spaces such as malls, campuses, or transport stations.

It was developed as part of an internship to understand the integration of software and hardware, covering backend API integration, video management, and data logging.

⚙️ Features
🔁 Continuous video playback loop from cloud-based API

📥 Auto-download videos from a remote server (using REST API)

🧠 Intelligent video management: deletes expired/unlisted videos

📸 Screenshot capture (local display only)

👁️ Real-time viewer count (in progress using OpenCV & camera module)

🧾 Logging of playback history with timestamps (JSON storage)

🌐 WiFi connectivity check before downloading

💽 Compatible with OMXPlayer for Raspberry Pi

🧰 Tech Stack
Layer	Tools / Technologies
Hardware	Raspberry Pi, Camera Module (USB/PiCam)
Backend/API	Python, REST API (video JSON source)
Video Player	OMXPlayer (for Raspberry Pi playback)
Libraries	cv2, pyautogui, requests, socket, json, subprocess, datetime, os, platform
Image Capture	pyautogui (Windows only, limited on Pi)
View Counter	OpenCV with face detection (WIP)

🗂️ Folder Structure
bash
Copy
Edit
/videos             # Downloaded video files
/screenshots        # Screenshots captured during playback
data.json           # Playback logs with start & end timestamps
main.py             # Main script that ties all functionality together
🚀 Setup Instructions
Clone the repository and transfer to your Raspberry Pi.

Install required Python packages:

bash
Copy
Edit
pip install opencv-python pyautogui requests keyboard
Update your omxplayer if needed using:

bash
Copy
Edit
sudo apt-get install omxplayer
Ensure the correct paths are set for your videos and screenshots folders.

Run the main script:

bash
Copy
Edit
python3 main.py
🔍 Current Limitations
Screenshots captured via pyautogui only work in desktop environments (not headless/terminal on Raspberry Pi).

Real-time viewer detection is still in development and being optimized for performance on the Pi.

📈 Future Improvements
✅ Fully functional people counter using OpenCV & Pi Camera

🔄 Admin dashboard to monitor screens remotely

🕒 Scheduling of video playback

🔐 Secured file transfer and authentication

👨‍💻 Developed By
Internship Team – 2025

Technologies taught and guided by mentors during industrial training.
