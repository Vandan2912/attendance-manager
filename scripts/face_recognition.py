# scripts/face_recognition.py
import face_recognition
import os
import sys

def load_known_faces(known_faces_dir):
    known_encodings = {}
    for file in os.listdir(known_faces_dir):
        if file.endswith(('.jpg', '.jpeg', '.png')):
            image_path = os.path.join(known_faces_dir, file)
            image = face_recognition.load_image_file(image_path)
            encoding = face_recognition.face_encodings(image)
            if encoding:
                # Assume the file name (without extension) is the student ID or email.
                student_id = os.path.splitext(file)[0]
                known_encodings[student_id] = encoding[0]
    return known_encodings

def recognize_face(known_encodings, unknown_image_path, tolerance=0.6):
    unknown_image = face_recognition.load_image_file(unknown_image_path)
    unknown_encodings = face_recognition.face_encodings(unknown_image)
    if not unknown_encodings:
        return None
    unknown_encoding = unknown_encodings[0]

    for student_id, known_encoding in known_encodings.items():
        matches = face_recognition.compare_faces([known_encoding], unknown_encoding, tolerance)
        if matches[0]:
            return student_id
    return None

if __name__ == "__main__":
    # The known faces directory should contain images named with the student identifier.
    known_faces_dir = "known_faces"
    if len(sys.argv) < 2:
        print("Usage: python face_recognition.py <unknown_image_path>")
        sys.exit(1)
    unknown_image_path = sys.argv[1]
    known_encodings = load_known_faces(known_faces_dir)
    student = recognize_face(known_encodings, unknown_image_path)
    if student:
        print(student)
    else:
        print("No matching face found")
