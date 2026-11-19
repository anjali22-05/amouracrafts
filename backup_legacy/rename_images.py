import os

images_dir = "images"
files = [f for f in os.listdir(images_dir) if f.endswith(".jpeg") or f.endswith(".jpg")]
files.sort()

count = 1
for f in files:
    old_path = os.path.join(images_dir, f)
    new_name = f"img_{count}.jpg"
    new_path = os.path.join(images_dir, new_name)
    os.rename(old_path, new_path)
    print(f"Renamed {f} to {new_name}")
    count += 1
