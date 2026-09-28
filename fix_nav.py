import re

def insert_nav(filename, is_plants_page=False):
    with open(filename, 'r', encoding='utf-8') as f:
        content = f.read()
    
    # Check if Tree & Plants is already there
    if 'Tree & Plants</a>' in content and not is_plants_page:
        return
        
    href = "#home" if is_plants_page else "plants.html"
    
    new_nav_item = f'<li><a href="{href}">Tree & Plants</a></li>\n                <li><a href="'
    
    content = content.replace('<li><a href="#about">', new_nav_item + '#about">')
    content = content.replace('<li><a href="index.html#about">', new_nav_item + 'index.html#about">')

    with open(filename, 'w', encoding='utf-8') as f:
        f.write(content)

insert_nav('index.html', False)
insert_nav('plants.html', True)
print("Nav updated.")
