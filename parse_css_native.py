import re

with open('index.html', 'r', encoding='utf-8') as f:
    html = f.read()

styles = re.findall(r'<style[^>]*>(.*?)</style>', html, re.DOTALL)
for css in styles:
    blocks = re.findall(r'([^{]+)\{([^}]+)\}', css)
    for selector, rules in blocks:
        if 'img' in selector:
            print(selector.strip() + " {\n  " + rules.strip() + "\n}")
