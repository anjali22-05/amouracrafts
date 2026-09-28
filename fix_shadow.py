import re
with open('index.html', 'r', encoding='utf-8') as f:
    content = f.read()

# Replace box-shadow with drop-shadow for .brand-logo
content = re.sub(
    r'box-shadow:\s*0\s*0\s*12px\s*rgba\(232,\s*135,\s*30,\s*0\.4\);',
    'filter: drop-shadow(0 0 8px rgba(232, 135, 30, 0.4));',
    content
)

content = re.sub(
    r'box-shadow:\s*0\s*0\s*16px\s*rgba\(244,\s*221,\s*142,\s*0\.6\);',
    'filter: drop-shadow(0 0 12px rgba(244, 221, 142, 0.6));',
    content
)

# And remove box-shadow from transition property if present
content = re.sub(r'transition:\s*transform\s*\.3s\s*ease,\s*box-shadow\s*\.3s\s*ease;', 'transition: transform .3s ease, filter .3s ease;', content)

with open('index.html', 'w', encoding='utf-8') as f:
    f.write(content)

print("Shadows fixed.")
