import os
import re

workspace = r"c:\Users\admin\Desktop\amouracrafts\amouracrafts-1"

def fix_html_file(filename, replacements):
    filepath = os.path.join(workspace, filename)
    with open(filepath, "r", encoding="utf-8") as f:
        content = f.read()
    
    for old, new in replacements.items():
        content = content.replace(old, new)
        
    with open(filepath, "w", encoding="utf-8") as f:
        f.write(content)
    print(f"Updated {filename}")

# Fix index.html unsplash links
index_replacements = {
    "https://images.unsplash.com/photo-1608865413608-6cfd1fc622b3?auto=format&fit=crop&w=1600&q=80": "images/img_19.jpg",
    "https://images.unsplash.com/photo-1606285461069-80ba562575dd?auto=format&fit=crop&w=500&q=80": "images/img_2.jpg",
    "https://images.unsplash.com/photo-1635192592106-77a5aacbe1a3?auto=format&fit=crop&w=500&q=80": "images/img_8.jpg",
    "https://images.unsplash.com/photo-1577083753695-e010191bacb5?auto=format&fit=crop&w=500&q=80": "images/img_19.jpg",
    "https://images.unsplash.com/photo-1679396147007-bb5c1af5ba22?auto=format&fit=crop&w=500&q=80": "images/resin_1.jpg",
}

# Fix about.html unsplash links
about_replacements = {
    "https://images.unsplash.com/photo-1530103862676-de8c9debad1d?auto=format&fit=crop&w=1600&q=80": "images/resin_4.jpg",
}

# Fix plants.html unsplash links
plants_replacements = {
    "https://images.unsplash.com/photo-1608865413608-6cfd1fc622b3?auto=format&fit=crop&w=1600&q=80": "images/plant_2.jpg",
    "https://images.unsplash.com/photo-1606285461069-80ba562575dd?auto=format&fit=crop&w=500&q=80": "images/plant_1.jpg",
    "https://images.unsplash.com/photo-1635192592106-77a5aacbe1a3?auto=format&fit=crop&w=500&q=80": "images/plant_2.jpg",
    "https://images.unsplash.com/photo-1577083753695-e010191bacb5?auto=format&fit=crop&w=500&q=80": "images/plant_3.jpg",
    "https://images.unsplash.com/photo-1679396147007-bb5c1af5ba22?auto=format&fit=crop&w=500&q=80": "images/plant_4.jpg",
}

fix_html_file("index.html", index_replacements)
fix_html_file("about.html", about_replacements)
fix_html_file("plants.html", plants_replacements)

# Verification script to check all image references in all HTML files
print("\n" + "="*60)
print("VERIFYING ALL IMAGE REFERENCES IN PROJECT:")
print("="*60)

all_ok = True
for html_name in ["index.html", "about.html", "plants.html"]:
    filepath = os.path.join(workspace, html_name)
    with open(filepath, "r", encoding="utf-8") as f:
        html_text = f.read()
    
    # regex for src="..." or url(...) or img: "..."
    matches = re.findall(r'(?:src=[\"\\\']|url\([\"\\\']?|img:\s*[\"\\\'])([^\"\\\'\(\)\>\s]+\.(?:png|jpg|jpeg|webp|gif|svg))', html_text, re.IGNORECASE)
    print(f"\n--- {html_name} ---")
    for img_ref in set(matches):
        if img_ref.startswith("http://") or img_ref.startswith("https://") or img_ref.startswith("data:"):
            print(f"  [EXTERNAL/DATA] {img_ref}")
            continue
        rel_path = img_ref.lstrip("/")
        full_path = os.path.normpath(os.path.join(workspace, rel_path))
        exists = os.path.exists(full_path)
        status = "OK" if exists else "MISSING / BROKEN 404"
        if not exists:
            all_ok = False
        print(f"  [{status}] {img_ref}")

if all_ok:
    print("\nSUCCESS: All image references in HTML/CSS/JS point to real existing files!")
else:
    print("\nWARNING: Some image references are still broken.")
