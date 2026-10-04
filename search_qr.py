import os

workspace = r"c:\Users\admin\Desktop\amouracrafts\amouracrafts-1"

print("All files in workspace:")
for root, dirs, files in os.walk(workspace):
    if ".git" in root:
        continue
    for f in files:
        full_path = os.path.join(root, f)
        print(" -", os.path.relpath(full_path, workspace))
