import face_recognition
import cv2
import pickle
from datetime import datetime

# Load the trained model
with open("face_encodings.pickle", "rb") as f:
    data = pickle.load(f)
known_encodings = data["encodings"]
known_names = data["names"]

# Initialize webcam
video_capture = cv2.VideoCapture(0)

# Attendance log to prevent duplicate entries
attendance_log = set()

def mark_attendance(name):
    if name not in attendance_log:
        attendance_log.add(name)
        with open("attendance_log.csv", "a") as file:
            now = datetime.now()
            timestamp = now.strftime("%Y-%m-%d %H:%M:%S")
            file.write(f"{name},{timestamp}\n")
        print(f"Attendance marked for {name} at {timestamp}")

print("Starting attendance system. Press 'q' to quit.")

while True:
    # Capture frame-by-frame
    ret, frame = video_capture.read()
    if not ret:
        print("Failed to capture frame. Exiting...")
        break

    # Convert the frame to RGB (OpenCV uses BGR by default)
    rgb_frame = frame[:, :, ::-1]

    # Find all face locations and face encodings in the frame
    face_locations = face_recognition.face_locations(rgb_frame)
    face_encodings = face_recognition.face_encodings(rgb_frame, face_locations)

    for face_encoding in face_encodings:
        # Check if the face matches any known faces
        matches = face_recognition.compare_faces(known_encodings, face_encoding)
        name = "Unknown"

        if True in matches:
            matchedIdxs = [i for (i, b) in enumerate(matches) if b]
            counts = {}
            for i in matchedIdxs:
                name = known_names[i]
                counts[name] = counts.get(name, 0) + 1
            name = max(counts, key=counts.get)

        # Mark attendance for the recognized face
        if name != "Unknown":
            mark_attendance(name)

    # Display the resulting frame with bounding boxes around detected faces
    for (top, right, bottom, left), name in zip(face_locations, [name] * len(face_locations)):
        color = (0, 255, 0) if name != "Unknown" else (0, 0, 255)
        cv2.rectangle(frame, (left, top), (right, bottom), color, 2)
        cv2.putText(frame, name, (left, top - 10), cv2.FONT_HERSHEY_SIMPLEX, 0.75, color, 2)

    cv2.imshow('Attendance Camera', frame)

    # Break the loop on 'q' key press
    if cv2.waitKey(1) & 0xFF == ord('q'):
        break

# Release the webcam and close windows
video_capture.release()
cv2.destroyAllWindows()
