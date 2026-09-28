import re

with open('plants.html', 'r', encoding='utf-8') as f:
    content = f.read()

new_products = """
        const PRODUCTS = [
            {
                id: "plant-1",
                name: "Pressed Flower Resin Earrings",
                desc: "Beautiful handmade earrings featuring delicate pressed purple flowers preserved in clear resin.",
                price: 349,
                mrp: 499,
                tag: "Botanical Art",
                img: "images/plant_1.jpg"
            },
            {
                id: "plant-2",
                name: "Syngonium Potted Plant",
                desc: "Lush green Syngonium (Arrowhead plant) in a premium ceramic pot. Perfect for office desks.",
                price: 499,
                mrp: 699,
                tag: "Bestseller",
                img: "images/plant_2.jpg"
            },
            {
                id: "plant-3",
                name: "Jade Bonsai Plant",
                desc: "Beautiful cascading Jade plant in a rustic blue ceramic planter. A symbol of good luck.",
                price: 599,
                mrp: 899,
                tag: "Premium",
                img: "images/plant_3.jpg"
            },
            {
                id: "plant-4",
                name: "Succulent Bowl Arrangement",
                desc: "A stunning arrangement of rosette succulents in a white ceramic bowl. Low maintenance.",
                price: 799,
                mrp: 1099,
                tag: "Trending",
                img: "images/plant_4.jpg"
            }
        ];
"""

content = re.sub(r'const PRODUCTS = \[.*?\];', new_products.strip(), content, flags=re.DOTALL)

with open('plants.html', 'w', encoding='utf-8') as f:
    f.write(content)

print("Plants updated.")
