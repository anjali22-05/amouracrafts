import re

with open('index.html', 'r', encoding='utf-8') as f:
    content = f.read()

content = re.sub(
    r'(<a href="#home" class="brand"><img src="images/logo\.jpg" alt="Amoura Crafts Logo" class="brand-logo">)\s*Amoura&nbsp;Crafts</a>',
    r'\1</a>',
    content
)

with open('index.html', 'w', encoding='utf-8') as f:
    f.write(content)

print("Removed text from header")
