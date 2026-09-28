import re

with open('index.html', 'r', encoding='utf-8') as f:
    content = f.read()

# 1. Fix the constant definition
content = re.sub(
    r'const\s+WHATSAPP_NUMBER\s*=\s*"[^"]*";',
    'const WHATSAPP_NUMBER = "918700689036";',
    content
)

# 2. Fix openWhatsApp function to use the constant
content = re.sub(
    r'https://wa\.me/\$\{?[0-9]*\}?\?text=',
    'https://wa.me/${WHATSAPP_NUMBER}?text=',
    content
)

# 3. Update the text in footer
content = content.replace('+91 90000\n                                00000', '+91 87006 89036')
content = content.replace('+91 90000 00000', '+91 87006 89036')

with open('index.html', 'w', encoding='utf-8') as f:
    f.write(content)

print("WhatsApp number updated successfully.")
