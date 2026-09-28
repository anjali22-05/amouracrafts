import re

with open('index.html', 'r', encoding='utf-8') as f:
    content = f.read()

resin_section = """
    <section class="section" id="resin">
        <div class="container">
            <div class="section-head reveal">
                <span class="eyebrow">RESIN ART</span>
                <h2>Custom Handcrafted Resin Creations</h2>
                <p>Explore our beautiful collection of custom resin art, including wall clocks, decorative plaques, and personalized tags. Reach out on WhatsApp to customize your piece!</p>
            </div>
            <div class="product-grid" id="resinGrid"></div>
        </div>
    </section>
"""

# Insert before <section class="section glow-field" id="bulk">
content = content.replace('<section class="section glow-field" id="bulk">', resin_section + '\n    <section class="section glow-field" id="bulk">')

# We need to add JS to render resinGrid or hardcode it. Let's render it using JS similar to PRODUCTS.
# I will append the RESIN_PRODUCTS array and render function before the closing </script>
js_code = """
        const RESIN_PRODUCTS = [
            {
                id: "resin-1",
                name: "Ganesha Resin Art Tray",
                desc: "Elegant square resin tray featuring Lord Ganesha, infused with gold flakes, crimson, and white.",
                price: 899,
                mrp: 1299,
                tag: "Bestseller",
                img: "images/resin_1.jpg"
            },
            {
                id: "resin-2",
                name: "Resin Name Tags Collection",
                desc: "Assorted custom resin tags with fun text like 'Pyari Bhabhi', 'Little Bro', and more.",
                price: 249,
                mrp: 399,
                tag: "Custom",
                img: "images/resin_2.png"
            },
            {
                id: "resin-3",
                name: "Brother Resin Tags Set",
                desc: "Matching 'Little Bro' & 'Big Brother' resin tags in warm orange and gold hues.",
                price: 449,
                mrp: 599,
                tag: "Trending",
                img: "images/resin_3.png"
            },
            {
                id: "resin-4",
                name: "Teal Geode Resin Wall Clock",
                desc: "Stunning large wall clock crafted with teal, gold, and white resin mimicking a geode slice.",
                price: 2499,
                mrp: 3299,
                tag: "Premium",
                img: "images/resin_4.jpg"
            },
            {
                id: "resin-5",
                name: "Pink Ganesha Resin Plaque",
                desc: "Beautiful round resin plaque in soft pink and white swirls with gold foil Ganesha.",
                price: 699,
                mrp: 999,
                tag: "New",
                img: "images/resin_5.png"
            }
        ];

        function renderResin() {
            const grid = document.getElementById("resinGrid");
            if(!grid) return;
            grid.innerHTML = RESIN_PRODUCTS.map(p => `
    <div class="card reveal">
      <div class="card-media">
        <span class="tag">${p.tag}</span>
        <img src="${p.img}" alt="${p.name}" loading="lazy">
      </div>
      <div class="card-body">
        <h3>${p.name}</h3>
        <p>${p.desc}</p>
        <div class="price-row">
            <div class="price">
                <span class="current">₹${p.price}</span>
                <span class="mrp">₹${p.mrp}</span>
            </div>
            <button class="btn btn-primary" onclick='buyNow(${JSON.stringify(p)}, 1)'>Buy</button>
        </div>
      </div>
    </div>
            `).join("");
        }
        
        // Ensure renderResin is called when page loads.
        // I will hook it into the window DOMContentLoaded or just call it directly since scripts are at the end.
        renderResin();
"""

content = content.replace('renderProducts();\n            initSparks();', 'renderProducts();\n            renderResin();\n            initSparks();')

# Inject the array definition before renderProducts
content = content.replace('function renderProducts()', js_code + '\n        function renderProducts()')

# Add a nav link for Resin
content = content.replace('<li><a href="#shop">Shop</a></li>', '<li><a href="#shop">Candles</a></li>\n                <li><a href="#resin">Resin Art</a></li>')

with open('index.html', 'w', encoding='utf-8') as f:
    f.write(content)

print("Resin section injected.")
