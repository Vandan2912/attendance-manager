# import face_recognition
# import os
# import pickle

# def train_face_recognition_model(image_folder="student_photos", output_file="face_encodings.pickle"):
#     known_encodings = []
#     known_names = []

#     for file_name in os.listdir(image_folder):
#         if file_name.endswith(('.jpg', '.jpeg', '.png')):
#             image_path = os.path.join(image_folder, file_name)
#             name = os.path.splitext(file_name)[0]

#             image = face_recognition.load_image_file(image_path)
#             encodings = face_recognition.face_encodings(image)

#             if encodings:
#                 known_encodings.append(encodings[0])
#                 known_names.append(name)

#     data = {"encodings": known_encodings, "names": known_names}
#     with open(output_file, "wb") as f:
#         pickle.dump(data, f)

#     print(f"Model trained and saved to {output_file}")

# # Train the model
# train_face_recognition_model()

import face_recognition
import os
import pickle

# # Paths for images and pickle files
# image_folder = "student_photos"
# pickle_file = "face_encodings.pickle"

# Dynamically get the project root directory
BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
image_folder = os.path.join(BASE_DIR, "scripts", "student_photos")
pickle_file = os.path.join(BASE_DIR, "scripts", "data", "face_data.pkl")

# Check if pickle file already exists
if os.path.exists(pickle_file):
    # Load existing encodings
    with open(pickle_file, "rb") as f:
        data = pickle.load(f)
    known_encodings = data["encodings"]
    known_names = data["names"]
    print("[✅] Loaded existing encodings from face_encodings.pickle")
else:
    # Create new data if no file exists
    known_encodings = []
    known_names = []

# Process each image in the folder
for file_name in os.listdir(image_folder):
    if file_name.endswith(('.jpg', '.jpeg', '.png')):
        # image_path = os.path.join(image_folder, file_name)
        image_path = os.path.join(BASE_DIR, "scripts", "student_photos", file_name)
        name = os.path.splitext(file_name)[0]

        # name = os.path.join(BASE_DIR, "scripts", "data", "face_encodings.pickle")

        # Skip the image if it's already trained
        if name in known_names:
            print(f"[⚠️] Skipping {name}, already trained.")
            continue

        # Load the image and extract face encodings
        image = face_recognition.load_image_file(image_path)
        encodings = face_recognition.face_encodings(image)

        # If face found, add it to dataset
        if encodings:
            known_encodings.append(encodings[0])
            known_names.append(name)
            print(f"[✅] Added new face encoding for: {name}")
        else:
            print(f"[❌] No face found in: {file_name}")

# Save the updated data back to pickle file
data = {"encodings": known_encodings, "names": known_names}
with open(pickle_file, "wb") as f:
    pickle.dump(data, f)

print("\n[🎉] Training completed and saved to face_encodings.pickle")
