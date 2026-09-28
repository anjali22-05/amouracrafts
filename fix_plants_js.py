with open('plants.html', 'r', encoding='utf-8') as f:
    content = f.read()

content = content.replace("love your candles", "love your plants")

with open('plants.html', 'w', encoding='utf-8') as f:
    f.write(content)
print("Fixed JS in plants.html")
