import pickle

with open('data/face_data.pkl', 'rb') as f:
    faces_data = pickle.load(f)

# with open('data/names.pkl', 'rb') as f:
#     names = pickle.load(f)

print(f"Total Faces Stored: {len(faces_data)}")
# print(f"Names: {names}")
