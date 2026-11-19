with open('index.html', 'r', encoding='utf-8') as f:
    content = f.read()

# Update logo references
content = content.replace('logo.png', 'logo.jpg')

# Update brand name
content = content.replace('Deep Roshni', 'Amoura Crafts')
content = content.replace('DEEP ROSHNI', 'AMOURA CRAFTS')
content = content.replace('Deep Roshni!', 'Amoura Crafts!')

with open('index.html', 'w', encoding='utf-8') as f:
    f.write(content)

print("Brand updated successfully.")
