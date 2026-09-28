with open('index.html', 'r', encoding='utf-8') as f:
    content = f.read()

content = content.replace('type="image/png" href="images/logo.jpg"', 'type="image/jpeg" href="images/logo.jpg"')

with open('index.html', 'w', encoding='utf-8') as f:
    f.write(content)

print("Icon type fixed.")
