import re

with open('plants.html', 'r', encoding='utf-8') as f:
    content = f.read()

# Replace Amoura Crafts with Vpam Cosultancy Private Limited
content = content.replace('Amoura Crafts', 'Vpam Cosultancy Private Limited')
content = content.replace('AMOURA CRAFTS', 'VPAM COSULTANCY PRIVATE LIMITED')

# In the nav links, the link to the home page should maybe still say "Amoura Crafts"?
# If the whole page is Vpam, then it's fine. 
# But wait, the WhatsApp messages will say "Hi Vpam Cosultancy Private Limited!"
# That's perfectly fine.

with open('plants.html', 'w', encoding='utf-8') as f:
    f.write(content)

print("Brand updated in plants.html")
