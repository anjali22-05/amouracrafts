import re

with open('index.html', 'r', encoding='utf-8') as f:
    content = f.read()

# Replace img_30.jpg with img_24.jpg in HTML
content = content.replace('img_30.jpg', 'img_24.jpg')

# We need to remove the last 7 products.
# The products are in an array: const PRODUCTS = [ { ... }, { ... } ];
# Let's find all occurrences of objects in the PRODUCTS array.
# It might be easier to just remove everything from the object containing img_25.jpg down to img_31.jpg
# Let's find the start of the object with img_25.jpg
start_idx = content.find('id: "autumn-spice-pumpkin"')
if start_idx == -1:
    # try another way, let's just find the start of the object before img_25
    match = re.search(r'\s*\{\s*id:\s*"[^"]+",\s*name:\s*"[^"]+",\s*desc:\s*"[^"]+",\s*price:\s*\d+,\s*mrp:\s*\d+,\s*tag:\s*"[^"]+",\s*img:\s*"images/img_25\.jpg"\s*\},?', content)
    if not match:
        # let's try a more relaxed regex
        match = re.search(r'\s*\{[^{]*?img:\s*"images/img_25\.jpg"\s*\},?', content)

if match:
    # let's just use regex to remove objects 25 to 31
    for i in range(25, 32):
        pattern = r'\s*\{[^{]*?img:\s*"images/img_' + str(i) + r'\.jpg"\s*\},?'
        content = re.sub(pattern, '', content)

# Check if there's a trailing comma left before the closing bracket of PRODUCTS array
# This might happen if the 31st item didn't have a comma, but the 24th item did.
content = re.sub(r',\s*\];', '\n        ];', content)

with open('index.html', 'w', encoding='utf-8') as f:
    f.write(content)

print("HTML updated.")
