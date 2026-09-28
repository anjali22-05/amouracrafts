with open('index.html', 'r', encoding='utf-8') as f:
    content = f.read()

content = content.replace('PRODUCTS[30]  // Marigold Swirl Candle Set (img_31)', 'PRODUCTS[23]  // Replaced with last product')

with open('index.html', 'w', encoding='utf-8') as f:
    f.write(content)

print("Fixed showcase")
