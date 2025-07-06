import os
import subprocess
import webbrowser
import pyautogui
import time
import cv2
import requests
from mtcnn import MTCNN

# Global variables to track the current video and start time
current_video = None
start_time = None

def run_server(folder_path):
    # Change to the specified folder
    os.chdir(folder_path)

    # Open a command prompt and run the server command
    subprocess.Popen(["start", "cmd", "/k", "node server.js"], shell=True)

    # Wait for a few seconds to ensure the server starts (adjust as needed)
    time.sleep(0.8)

    pyautogui.hotkey('winleft', 'down')

    webbrowser.open("http://localhost:4000")

    # time.sleep(1)
    time.sleep(2)

    screenWidth, screenHeight = pyautogui.size()
    pyautogui.click(screenWidth // 2, screenHeight // 2)
    
    # time.sleep(1)


def update_viewer_data(viewer_count, start_time):
    # Send a POST request to update the viewer data
    url = "http://localhost:4000/update-viewer-data"
    payload = {
        "viewerCount": viewer_count,
        "startTime": start_time,
    }
    response = requests.post(url, json=payload)

    if response.status_code == 200:
        print("Viewer data updated successfully.")
    else:
        print("Failed to update viewer data.")



def get_current_video_info():
    # Send a GET request to the server to get information about the current video
    url = "http://localhost:4000/current-video-info"
    response = requests.get(url)

    if response.status_code == 200:
        current_video_info = response.json()
        return current_video_info
    else:
        print("Failed to get current video info.")
        return None
    
    
    
    
def count_people():
    global current_video, start_time
    prev_face_count = None
    # prev_video = None

    # Load the MTCNN model for face detection
    face_detector = MTCNN()

    # Open the camera (change the argument to 0 for the default camera)
    cap = cv2.VideoCapture(0)

    # Set up a set to store unique face IDs
    unique_faces = set()

    while True:
        # Read a frame from the camera
        ret, frame = cap.read()
        
        current_video_info = get_current_video_info()
        if current_video_info:
            current_video = current_video_info.get('currentVideo')

        # Check if the frame was successfully read
        if not ret:
            print("Failed to capture frame. Exiting...")
            break

        # Detect faces in the frame using MTCNN
        faces = face_detector.detect_faces(frame)
        print(faces, unique_faces)

        # Display the number of people currently in front of the laptop
        current_face_count = len(faces)
        print(f"Number of people in front of the laptop: {current_face_count}")

        # Get the current time
        current_time = time.strftime('%Y-%m-%d %H:%M:%S')

        # Check if the current video has changed
        if current_face_count != prev_face_count or current_video != prev_video:
            update_viewer_data(current_face_count, current_time)
            prev_face_count = current_face_count  # Update the previous face count
            prev_video = current_video  


        # Draw rectangles around the detected faces
        for face in faces:
            x, y, w, h = face['box']
            # Calculate a unique face ID based on position
            face_id = hash((x, y, w, h))

            # Check if the face is new
            if face_id not in unique_faces:
                unique_faces.add(face_id)
                cv2.rectangle(frame, (x, y), (x + w, y + h), (0, 255, 0), 2)

        # Display the frame
        cv2.imshow('Camera', frame)

        # Break the loop when 'q' is pressed
        if cv2.waitKey(1) & 0xFF == ord('q'):
            break

    # Release the camera and close all windows
    cap.release()
    cv2.destroyAllWindows()




if __name__ == "__main__":
    folder_path = r"C:\Users\sahil\Desktop\Freelance\Final Year Project - nodejs\server-side"  # Replace with your folder path
    run_server(folder_path)
    count_people()
