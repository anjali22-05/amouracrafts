import re

with open('index.html', 'r', encoding='utf-8') as f:
    index_content = f.read()

# 1. Update index.html to include the new link
new_nav_item = '<li><a href="plants.html">Tree & Plants</a></li>\n                <li><a href="#about">About</a></li>'
index_content = index_content.replace('<li><a href="#about">About</a></li>', new_nav_item)

with open('index.html', 'w', encoding='utf-8') as f:
    f.write(index_content)

# 2. Create plants.html based on index.html
plants = index_content

# Update title
plants = plants.replace('<title>Amoura Crafts — Handcrafted Diwali Candles</title>', '<title>Amoura Crafts — Tree & Plants</title>')

# Update nav links in plants.html
plants = plants.replace('href="#home"', 'href="index.html"')
plants = plants.replace('href="#shop"', 'href="index.html#shop"')
plants = plants.replace('href="#resin"', 'href="index.html#resin"')
plants = plants.replace('href="#showcase"', 'href="index.html#showcase"')
plants = plants.replace('href="#bulk"', 'href="index.html#bulk"')
plants = plants.replace('href="#about"', 'href="index.html#about"')
plants = plants.replace('href="plants.html"', 'href="#home"') # current page

# Update Hero section
plants = re.sub(r'<h1>.*?</h1>', '<h1>Bring Nature Home</h1>', plants, count=1)
plants = re.sub(r'<p class="lede">.*?</p>', '<p class="lede">Explore our collection of beautiful trees and indoor plants to breathe life into your space. 🌿</p>', plants, count=1)

# Update Shop section
plants = plants.replace('Candles for every corner of the celebration', 'Trees & Plants for every space')
plants = plants.replace('Pick a single piece to gift, or stock up for the whole house. Every order can be paid on delivery or\n                    online — we\'ll confirm details on WhatsApp.', 'Lush greens and beautiful trees hand-picked for you. Reach out on WhatsApp to confirm delivery.')
plants = plants.replace('THE COLLECTION', 'OUR PLANTS')

# Remove Resin section from plants page
plants = re.sub(r'<section class="section" id="resin">.*?</section>', '', plants, flags=re.DOTALL)

# Remove Showcase section
plants = re.sub(r'<section class="section" id="showcase">.*?</section>', '', plants, flags=re.DOTALL)

# Replace products array in plants page with some plant placeholders
plant_products_js = """
        const PRODUCTS = [
            {
                id: "plant-1",
                name: "Monstera Deliciosa",
                desc: "Classic indoor plant with iconic split leaves. Perfect for bright indirect light.",
                price: 599,
                mrp: 899,
                tag: "Bestseller",
                img: "https://images.unsplash.com/photo-1614594975525-e45190c55d40?auto=format&fit=crop&w=600&q=80"
            },
            {
                id: "plant-2",
                name: "Fiddle Leaf Fig Tree",
                desc: "Elegant tall tree for your living room. Adds a structural green touch.",
                price: 1299,
                mrp: 1899,
                tag: "Premium",
                img: "https://images.unsplash.com/photo-1597055181308-f9104084eb70?auto=format&fit=crop&w=600&q=80"
            },
            {
                id: "plant-3",
                name: "Snake Plant",
                desc: "Low maintenance air-purifying plant, perfect for beginners.",
                price: 349,
                mrp: 499,
                tag: "Easy Care",
                img: "https://images.unsplash.com/photo-1599421498111-e40ce3677350?auto=format&fit=crop&w=600&q=80"
            },
            {
                id: "plant-4",
                name: "Rubber Plant (Burgundy)",
                desc: "Stunning dark foliage that contrasts beautifully with bright interiors.",
                price: 499,
                mrp: 699,
                tag: "Trending",
                img: "https://images.unsplash.com/photo-1601242385419-4a0b28ec4b96?auto=format&fit=crop&w=600&q=80"
            }
        ];
"""
plants = re.sub(r'const PRODUCTS = \[.*?\];', plant_products_js, plants, flags=re.DOTALL)

# Remove RESIN_PRODUCTS and renderResin from JS
plants = re.sub(r'const RESIN_PRODUCTS = \[.*?\];', '', plants, flags=re.DOTALL)
plants = re.sub(r'function renderResin\(\) \{.*?\}', '', plants, flags=re.DOTALL)
plants = plants.replace('renderResin();\n', '')

with open('plants.html', 'w', encoding='utf-8') as f:
    f.write(plants)

print("plants.html created and index.html updated.")
