import re

def update_file(filename):
    with open(filename, 'r', encoding='utf-8') as f:
        content = f.read()

    # .brand-logo width/height
    content = re.sub(r'width:\s*46px;', 'width: 56px;', content)
    content = re.sub(r'height:\s*46px;', 'height: 56px;', content)

    # .hero-brand-logo height
    content = re.sub(r'height:\s*72px;', 'height: 86px;', content)

    with open(filename, 'w', encoding='utf-8') as f:
        f.write(content)

update_file('index.html')
update_file('plants.html')

print("Logos increased.")
