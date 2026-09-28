import re
with open('index.html', 'r', encoding='utf-8') as f:
    html = f.read()

for i, css in enumerate(re.findall(r'<style[^>]*>(.*?)</style>', html, re.DOTALL)):
    print(f"Style block {i}:")
    blocks = re.findall(r'(@media[^{]+\{.*?\})|([^{]+)\{([^}]+)\}', css, re.DOTALL)
    for media, selector, rules in blocks:
        if media:
            pass # We'll just look at selectors
        elif 'card-media' in selector or 'candle-card' in selector or 'ring-item' in selector:
            print(selector.strip() + " {\n  " + rules.strip() + "\n}")
