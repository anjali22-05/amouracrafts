import re
import glob

def process_file(filepath):
    with open(filepath, 'r', encoding='utf-8') as f:
        content = f.read()

    original_content = content
    
    # 1. FOOTER NAME
    content = content.replace("Made by Anjali Verma 🪔", "Made by Harsh Verma 🥰")
    content = content.replace("Made with 🪔 by Anjali Verma", "Made by Harsh Verma 🥰")
    
    # 2. CUSTOMER CUSTOM COLOR OPTION
    color_field_html = """
                    <div class="checkout-field full">
                        <label for="customColor">Preferred Color (Optional)</label>
                        <input id="customColor" name="customColor" type="text" list="colorOptions" placeholder="e.g. Sky Blue, Custom Pink, Default">
                        <datalist id="colorOptions">
                            <option value="Sky Blue">
                            <option value="Dark Red">
                            <option value="Lavender">
                            <option value="Custom Pink">
                            <option value="White">
                            <option value="Gold">
                        </datalist>
                    </div>
"""
    if '<label for="address">Street Address</label>' in content and 'id="customColor"' not in content:
        content = content.replace(
            '<div class="checkout-field full">\n                        <label for="address">Street Address</label>',
            color_field_html.strip('\n') + '\n                    <div class="checkout-field full">\n                        <label for="address">Street Address</label>'
        )

    # 3. FREE DELIVERY LOGIC & Color passing logic
    
    # Add color to customer object
    if 'note: form.note.value.trim()' in content and 'customColor: form.customColor' not in content:
        content = content.replace(
            'note: form.note.value.trim()',
            'note: form.note.value.trim(),\n                customColor: (form.customColor ? form.customColor.value.trim() : "")'
        )

    # Add preferredColor to buildCustomerOrderFromDraft
    if 'notes: customer.note || "",' in content and 'preferredColor: customer.customColor' not in content:
        content = content.replace(
            'notes: customer.note || "",',
            'notes: customer.note || "",\n                preferredColor: customer.customColor || "",'
        )

    # Update buildCustomerOrderFromDraft shipping calculation
    if 'const subtotal = getOrderSubtotal(items);' in content and 'let shipping =' not in content:
        content = content.replace(
            'const subtotal = getOrderSubtotal(items);',
            'const subtotal = getOrderSubtotal(items);\n            const shipping = subtotal > 1000 ? 0 : 100;'
        )
        content = content.replace(
            'shipping: 0,\n                discount: 0,\n                finalTotal: subtotal,',
            'shipping: shipping,\n                discount: 0,\n                finalTotal: subtotal + shipping,'
        )

    # WhatsApp message additions
    # Admin WhatsApp
    if '`Email: ${order.customerEmail' in content and 'Preferred Color' not in content:
        content = content.replace(
            '`Email: ${order.customerEmail || order.customerDetails?.email || "N/A"}`,',
            '`Email: ${order.customerEmail || order.customerDetails?.email || "N/A"}`,\n                `Preferred Color: ${order.preferredColor || order.customerDetails?.customColor || "Default"}`,',
            1
        )
    # Customer WhatsApp
    if '`Total Amount: ₹${order.finalTotal}`,' in content and 'Preferred Color' not in content:
        content = content.replace(
            '`Total Amount: ₹${order.finalTotal}`,',
            '`Preferred Color: ${order.preferredColor || "Default"}`,\n                `Total Amount: ₹${order.finalTotal}`,\n                `Includes Delivery: ₹${order.shipping || 0}`,'
        )

    # Invoice PDF additions
    if 'doc.text(`Pincode:' in content and 'Preferred Color' not in content:
        content = content.replace(
            'doc.text(`Pincode: ${order.pincode || order.customerDetails.pincode}`, margin, y);\n            y += 26;',
            'doc.text(`Pincode: ${order.pincode || order.customerDetails.pincode}`, margin, y);\n            y += 16;\n            doc.text(`Preferred Color: ${order.preferredColor || "Default"}`, margin, y);\n            y += 26;'
        )

    # Checkout total dynamic update
    if 'totalEl.textContent = formatINR(subtotal);' in content and 'const shippingCharge' not in content:
        content = content.replace(
            'totalEl.textContent = formatINR(subtotal);',
            'const shippingCharge = subtotal > 1000 ? 0 : 100;\n            totalEl.innerHTML = `${formatINR(subtotal + shippingCharge)} <span style="font-size:0.8em; color:var(--gold-light); display:block; margin-top:4px;">${shippingCharge === 0 ? "Includes Free Delivery ✨" : "(Includes ₹100 Delivery)"}</span>`;'
        )
        
    # Free delivery banner HTML
    banner_html = """
    <div class="delivery-banner" style="background: linear-gradient(90deg, var(--maroon-900), var(--maroon-800)); border-bottom: 1px solid var(--gold); color: var(--cream); text-align: center; padding: 10px 12px; font-weight: 600; font-size: 0.95rem; letter-spacing: 0.05em; margin-top: 72px;">
        ✨ FREE DELIVERY ON ORDERS ABOVE ₹1000 ✨
    </div>
    """
    if '<div class="hero">' in content and 'FREE DELIVERY ON ORDERS ABOVE' not in content:
        content = content.replace('<div class="hero">', banner_html + '\n        <div class="hero">')

    # Add global responsive CSS fixes
    responsive_css = """
        /* RESPONSIVE FIXES */
        html, body { overflow-x: hidden; width: 100%; }
        .container { max-width: 100%; padding-left: 15px; padding-right: 15px; box-sizing: border-box; }
        .checkout-modal-content, .invoice-modal-content, .modal-content, .payment-modal-content { max-width: 95vw; box-sizing: border-box; }
        .checkout-grid, .invoice-grid { display: grid; gap: 12px; }
        @media (max-width: 600px) {
            .checkout-grid { grid-template-columns: 1fr; }
            .checkout-field { grid-column: 1 / -1; }
            .invoice-items th, .invoice-items td { font-size: 0.8rem; padding: 6px 4px; }
            .hero-grid { grid-template-columns: 1fr; gap: 24px; text-align: center; }
            .hero-copy h1 { font-size: clamp(2.2rem, 8vw, 3rem); }
        }
        img { max-width: 100%; height: auto; }
        .table-responsive { overflow-x: auto; -webkit-overflow-scrolling: touch; width: 100%; display: block; }
    """
    if '/* RESPONSIVE FIXES */' not in content:
        content = content.replace('</style>', responsive_css + '\n    </style>')

    if content != original_content:
        with open(filepath, 'w', encoding='utf-8') as f:
            f.write(content)
        print(f"Updated {filepath}")
    else:
        print(f"No changes made to {filepath}")

for f in glob.glob("*.html"):
    process_file(f)
