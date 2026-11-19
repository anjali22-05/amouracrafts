import re

def update_file(filename):
    with open(filename, 'r', encoding='utf-8') as f:
        content = f.read()
        
    content = content.replace('hello@amouracrafts.com', 'meltmanifestme@gmail.com')
    content = content.replace('hello@vpamcosultancyprivatelimited.com', 'meltmanifestme@gmail.com') # Just in case it was auto-replaced
    
    with open(filename, 'w', encoding='utf-8') as f:
        f.write(content)

update_file('index.html')
update_file('plants.html')

print("Email updated.")
