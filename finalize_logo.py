import re

with open('index.html', 'r', encoding='utf-8') as f:
    content = f.read()

# Revert to png
content = content.replace('logo.jpg', 'logo.png')

# Update .brand-logo
def replace_brand_logo(m):
    css = m.group(0)
    # increase size
    css = re.sub(r'width:\s*38px;', 'width: 46px;', css)
    css = re.sub(r'height:\s*38px;', 'height: 46px;', css)
    # remove border and radius
    css = re.sub(r'border-radius:\s*50%;', '', css)
    css = re.sub(r'border:\s*[^;]+;', '', css)
    # the image isn't perfectly square now, it's just the logo. 
    # we can remove object-fit if we want, or change to contain.
    css = re.sub(r'object-fit:\s*cover;', 'object-fit: contain;', css)
    return css

content = re.sub(r'\.brand-logo\s*\{[^}]+\}', replace_brand_logo, content)

# Update .hero-brand-logo
def replace_hero_logo(m):
    css = m.group(0)
    css = re.sub(r'height:\s*60px;', 'height: 72px;', css)
    return css

content = re.sub(r'\.hero-brand-logo\s*\{[^}]+\}', replace_hero_logo, content)

with open('index.html', 'w', encoding='utf-8') as f:
    f.write(content)

print("Updated CSS and HTML for the new logo.")
