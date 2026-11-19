import re

def update_file(filename):
    with open(filename, 'r', encoding='utf-8') as f:
        content = f.read()

    # .cart-empty-logo
    content = re.sub(r'(\.cart-empty-logo\s*\{[^}]*?height:\s*)40px', r'\g<1>48px', content)
    
    # .about-seal-logo
    content = re.sub(r'(\.about-seal-logo\s*\{[^}]*?width:\s*)120px', r'\g<1>144px', content)

    with open(filename, 'w', encoding='utf-8') as f:
        f.write(content)

update_file('index.html')
update_file('plants.html')

print("Other logos increased.")
