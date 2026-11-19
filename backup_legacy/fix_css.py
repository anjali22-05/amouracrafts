import re

with open('index.html', 'r', encoding='utf-8') as f:
    content = f.read()

# Fix .card-media img
content = re.sub(
    r'\.card-media img\s*\{[^}]*?width:\s*100%;\s*height:\s*100%;\s*object-fit:\s*cover;[^}]*?\}',
    lambda m: m.group(0).replace('width: 100%;', 'position: absolute; top: 0; left: 0; width: 100%;'),
    content
)

# Fix .ring-item img
content = re.sub(
    r'\.ring-item img\s*\{[^}]*?width:\s*100%;\s*height:\s*100%;\s*object-fit:\s*cover;[^}]*?\}',
    lambda m: m.group(0).replace('width: 100%;', 'position: absolute; top: 0; left: 0; width: 100%;'),
    content
)

# Fix .gallery img
content = re.sub(
    r'\.gallery img\s*\{[^}]*?width:\s*100%;\s*height:\s*100%;\s*object-fit:\s*cover;[^}]*?\}',
    lambda m: m.group(0).replace('width: 100%;', 'position: absolute; top: 0; left: 0; width: 100%;'),
    content
)

# Fix .candle-card img (just in case)
content = re.sub(
    r'\.candle-card img\s*\{[^}]*?width:\s*100%;\s*height:\s*100%;\s*object-fit:\s*cover;[^}]*?\}',
    lambda m: m.group(0).replace('width: 100%;', 'position: absolute; top: 0; left: 0; width: 100%;'),
    content
)


with open('index.html', 'w', encoding='utf-8') as f:
    f.write(content)

print("CSS Fixed")
