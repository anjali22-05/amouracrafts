with open('index.html', 'r', encoding='utf-8') as f:
    content = f.read()

content = content.replace('Deep&nbsp;Roshni', 'Amoura&nbsp;Crafts')
content = content.replace('deeproshni.example', 'amouracrafts.com')

with open('index.html', 'w', encoding='utf-8') as f:
    f.write(content)

print("Fixed remaining Deep Roshni references")
