import re

with open('plants.html', 'r', encoding='utf-8') as f:
    content = f.read()

# Fix eyebrow
content = content.replace('HANDCRAFTED FOR DIWALI 2026', 'LUSH GREENERY & BOTANICALS')

# Fix lede text
content = re.sub(
    r'<p class="lede">.*?</p>',
    '<p class="lede">Explore our collection of beautiful trees and indoor plants to breathe life into your space. 🌿</p>',
    content,
    flags=re.DOTALL
)

# Fix cta button href
content = content.replace('href="index.html#shop" class="btn btn-primary"', 'href="#shop" class="btn btn-primary"')

# Fix hero images
hero_images_replacement = """const HERO_IMAGES = [
            "images/plant_2.jpg",
            "images/plant_3.jpg",
            "images/plant_4.jpg",
            "images/plant_1.jpg"
        ];"""
content = re.sub(r'const HERO_IMAGES = \[.*?\];', hero_images_replacement, content, flags=re.DOTALL)

with open('plants.html', 'w', encoding='utf-8') as f:
    f.write(content)

print("Hero section fixed.")
