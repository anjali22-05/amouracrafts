import re

with open('index.html', 'r', encoding='utf-8') as f:
    content = f.read()

content = re.sub(
    r'(<a href="#home" class="brand"><img src="images/logo\.png" alt="Amoura Crafts Logo" class="brand-logo">)</a>',
    r'\1 Amoura Crafts</a>',
    content
)

with open('index.html', 'w', encoding='utf-8') as f:
    f.write(content)

print("Brand text restored in header.")
