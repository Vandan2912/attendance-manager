import face_recognition
import os
import sys
import pickle
import pymongo
from datetime import datetime

# ==============================
# ✅ Database Connection
# ==============================
client = pymongo.MongoClient("mongodb+srv://vandan:onGNv8Cgso9TwHKb@cluster0.6xhmq.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0")
db = client["test"]
collection = db["attendances"]

# ==============================
# ✅ Dynamic Paths
# ==============================
BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
image_folder = os.path.join(BASE_DIR, "scripts", "student_photos")
pickle_file = os.path.join(BASE_DIR, "scripts", "data", "face_encodings.pickle")


# ==============================
# ✅ Function to Load Known Faces
# ==============================
def load_known_faces():
    known_encodings = {}
    print("\n🚀 Loading student photos from:", image_folder)

    # Check if folder exists
    if not os.path.exists(image_folder):
        print(f"❌ [ERROR] Directory '{image_folder}' does not exist.")
        return known_encodings

    # Loop through all images
    for file in os.listdir(image_folder):
        if file.endswith(('.jpg', '.jpeg', '.png')):
            image_path = os.path.join(image_folder, file)
            image = face_recognition.load_image_file(image_path)
            encoding = face_recognition.face_encodings(image)

            if encoding:
                student_id = os.path.splitext(file)[0]
                known_encodings[student_id] = encoding[0]
                print(f"[✅] Added encoding for: {student_id}")
            else:
                print(f"[❌] No face found in: {file}")
    return known_encodings


# ==============================
# ✅ Function to Prevent Duplicate Attendance
# ==============================
def is_attendance_already_marked(student_id):
    today_date = datetime.now().strftime("%Y-%m-%d")
    existing_record = collection.find_one({
        "studentId": student_id,
        "markedAt": {"$regex": today_date}
    })
    return True if existing_record else False


# ==============================
# ✅ Function to Recognize Face
# ==============================
def recognize_face(image_path):
    # Load existing encodings
    if not os.path.exists(pickle_file):
        print("❌ [ERROR] Face encodings file not found!")
        return "Unknown"

    # Load encodings from pickle
    with open(pickle_file, "rb") as f:
        data = pickle.load(f)

    known_encodings = data["encodings"]
    known_names = data["names"]

    # Load unknown image
    image = face_recognition.load_image_file(image_path)
    encodings = face_recognition.face_encodings(image)
    print("☠️ encodings DONE")
    if encodings:
        matches = face_recognition.compare_faces(known_encodings, encodings[0])
        name = "Unknown"

        if True in matches:
            matchedIdxs = [i for (i, b) in enumerate(matches) if b]
            counts = {}
            for i in matchedIdxs:
                name = known_names[i]
                counts[name] = counts.get(name, 0) + 1

            # Return most matched student
            name = max(counts, key=counts.get)
            return name
    return None


# ==============================
# ✅ Function to Mark Attendance
# ==============================
def mark_attendance(student_id):
    now = datetime.now()
    timestamp = now.strftime("%Y-%m-%d %H:%M:%S")

    # Prevent Duplicate Attendance
    if is_attendance_already_marked(student_id):
        print(f"⚠️ [DUPLICATE] Attendance already marked for {student_id} today.\n")
        return

    # Save attendance to MongoDB
    record = {
        "studentId": student_id,
        "name": student_id.replace("_", " ").title(),
        "photo": f"student_photos/{student_id}.jpg",
        "markedAt": timestamp
    }
    collection.insert_one(record)

    # ✅ Clean Console Log
    print("\n====================================================")
    print(f"[✅] Attendance Marked for: {record['name']}")
    print(f"[📧] Photo Path: {record['photo']}")
    print(f"[📅] Date: {now.strftime('%d %B %Y')}  [🕘] Time: {now.strftime('%I:%M %p')}")
    print("====================================================\n")


# ==============================
# ✅ MAIN ENTRY POINT
# ==============================
if __name__ == "__main__":
    if len(sys.argv) < 2:
        print("Usage: python face_recognition.py <unknown_image_path>")
        sys.exit(1)

    # Pass the unknown image path
    unknown_image_path = sys.argv[1]

    # Train and save data if not already trained
    known_faces = load_known_faces()

    # Save encodings to pickle file
    data = {
        "encodings": list(known_faces.values()),
        "names": list(known_faces.keys())
    }
    with open(pickle_file, "wb") as f:
        pickle.dump(data, f)

    # Perform face recognition
    student_id = recognize_face(unknown_image_path)
    if student_id:
        mark_attendance(student_id)
    else:
        print("[❌] No matching face found.")
