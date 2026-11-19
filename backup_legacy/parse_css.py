from bs4 import BeautifulSoup
import re

with open('index.html', 'r', encoding='utf-8') as f:
    soup = BeautifulSoup(f, 'html.parser')

style_tags = soup.find_all('style')
for style in style_tags:
    css = style.string
    if css:
        blocks = re.findall(r'([^{]+)\{([^}]+)\}', css)
        for selector, rules in blocks:
            if 'img' in selector:
                print(selector.strip() + " { " + rules.strip() + " }")
