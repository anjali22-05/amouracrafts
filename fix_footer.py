import re

with open('index.html', 'r', encoding='utf-8') as f:
    content = f.read()

content = content.replace(
    '<span>Made for a warmer Diwali 🪔</span>',
    '<span>Made by Anjali Verma 🪔</span>'
)

with open('index.html', 'w', encoding='utf-8') as f:
    f.write(content)

print("Footer updated.")
