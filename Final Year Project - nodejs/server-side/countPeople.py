import cv2
from mtcnn import MTCNN

# Load the MTCNN model for face detection
face_detector = MTCNN()

# Open the camera (change the argument to 0 for the default camera)
cap = cv2.VideoCapture(0)

# Set up a set to store unique face IDs
unique_faces = set()

while True:
    # Read a frame from the camera
    ret, frame = cap.read()

    # Detect faces in the frame using MTCNN
    faces = face_detector.detect_faces(frame)
    print(faces, unique_faces)

    # Display the number of people currently in front of the laptop
    current_face_count = len(faces)
    print(f"Number of people in front of the laptop: {current_face_count}")

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
