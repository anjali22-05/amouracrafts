import re

with open('index.html', 'r', encoding='utf-8') as f:
    content = f.read()

def inject_hero_margin(m):
    css = m.group(0)
    # If margin is already there, replace it, else add it
    if 'margin:' in css:
        css = re.sub(r'margin:[^;]+;', 'margin: 24px 4vw;', css)
    else:
        css = css.replace('.hero {', '.hero {\n            margin: 0 4vw;\n            border-radius: 24px;')
        
    css = re.sub(r'min-height:\s*100svh;', 'min-height: calc(100svh - 48px);', css)
    return css

# We target the second .hero block which has min-height: 100svh;
content = re.sub(r'\.hero\s*\{[^}]*min-height:\s*100svh;[^}]*\}', inject_hero_margin, content)

with open('index.html', 'w', encoding='utf-8') as f:
    f.write(content)

print("Added margin to hero")
