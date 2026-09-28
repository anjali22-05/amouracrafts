import re

with open('plants.html', 'r', encoding='utf-8') as f:
    content = f.read()

# Replace the tags with plant-related terms
content = content.replace('"HANDCRAFTED"', '"FRESH"')
content = content.replace('"DIWALI GLOW"', '"LUSH GREEN"')
content = content.replace('"HEART CANDLES"', '"BEAUTIFUL TONES"')
content = content.replace('"COLOUR STORY"', '"BOTANICAL"')
content = content.replace('"FESTIVE SHAPE"', '"NATURE"')

with open('plants.html', 'w', encoding='utf-8') as f:
    f.write(content)

print("Tags fixed in plants.html")
