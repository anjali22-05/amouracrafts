import re

with open('index.html', 'r', encoding='utf-8') as f:
    content = f.read()

# Replace strings
content = content.replace(
    "openWhatsApp('Hi Amoura Crafts! I want to know more about your Diwali candles.')",
    "openWhatsApp('Hi Amoura Crafts! I absolutely love your collection and would love to know more about your beautiful candles! ✨')"
)

content = content.replace(
    "openWhatsApp('Hi, I have a question about my order.')",
    "openWhatsApp('Hi Amoura Crafts! I have a quick question regarding my recent order. 💕')"
)

content = content.replace(
    "openWhatsApp('Hi, I would like to know your return policy.')",
    "openWhatsApp('Hi Amoura Crafts! Could you please share some details about your return policy? Thank you! 🌸')"
)

content = content.replace(
    "openWhatsApp('Hi, I want to place a corporate gifting order.')",
    "openWhatsApp('Hi Amoura Crafts! We are interested in your stunning candles for corporate gifting. Would love to discuss this! ✨')"
)

content = content.replace(
    "openWhatsApp('Hi Amoura Crafts!')",
    "openWhatsApp('Hi Amoura Crafts! I just visited your website and your candles are gorgeous! 🕯️✨')"
)

content = content.replace(
    "openWhatsApp('Hi Amoura Crafts! I want to place an order.')",
    "openWhatsApp('Hi Amoura Crafts! I just explored your beautiful website and I would love to place an order! ✨')"
)

content = content.replace(
    "Hi Amoura Crafts! I'd like to buy:",
    "Hi Amoura Crafts! I absolutely love your candles and I would like to order the following:"
)

content = content.replace(
    "Hi Amoura Crafts! I'd like to order:",
    "Hi Amoura Crafts! I absolutely love your candles and I would like to order the following:"
)

with open('index.html', 'w', encoding='utf-8') as f:
    f.write(content)

print("Messages sweetened.")
