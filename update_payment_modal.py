import os
import shutil

workspace = r"c:\Users\admin\Desktop\amouracrafts\amouracrafts-1"
images_dir = os.path.join(workspace, "images")

# Make sure qr.png, scanner.png exist alongside logo.png in images/
logo_png = os.path.join(images_dir, "logo.png")
qr_png = os.path.join(images_dir, "qr.png")
scanner_png = os.path.join(images_dir, "scanner.png")

if os.path.exists(logo_png):
    if not os.path.exists(qr_png):
        shutil.copy2(logo_png, qr_png)
    if not os.path.exists(scanner_png):
        shutil.copy2(logo_png, scanner_png)

modal_css = """
/* ================================================================
   PAYMENT SCANNER / QR MODAL STYLES
   ================================================================ */
.payment-modal-overlay {
    position: fixed;
    top: 0;
    left: 0;
    width: 100vw;
    height: 100vh;
    background: rgba(15, 12, 10, 0.85);
    backdrop-filter: blur(10px);
    -webkit-backdrop-filter: blur(10px);
    z-index: 10000;
    display: flex;
    align-items: center;
    justify-content: center;
    opacity: 0;
    visibility: hidden;
    transition: opacity 0.3s cubic-bezier(0.16, 1, 0.3, 1), visibility 0.3s cubic-bezier(0.16, 1, 0.3, 1);
    padding: 20px;
}

.payment-modal-overlay.active {
    opacity: 1;
    visibility: visible;
}

.payment-modal-content {
    background: #1a1412;
    border: 1px solid rgba(235, 215, 190, 0.2);
    border-radius: 20px;
    width: 100%;
    max-width: 420px;
    padding: 28px 24px;
    position: relative;
    box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.8), 0 0 30px rgba(212, 175, 55, 0.15);
    transform: scale(0.92) translateY(20px);
    transition: transform 0.3s cubic-bezier(0.16, 1, 0.3, 1);
    text-align: center;
    color: #f5efe6;
}

.payment-modal-overlay.active .payment-modal-content {
    transform: scale(1) translateY(0);
}

.payment-modal-close {
    position: absolute;
    top: 16px;
    right: 18px;
    background: rgba(255, 255, 255, 0.08);
    border: 1px solid rgba(255, 255, 255, 0.15);
    color: #f5efe6;
    font-size: 24px;
    line-height: 1;
    width: 36px;
    height: 36px;
    border-radius: 50%;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    transition: all 0.2s ease;
}

.payment-modal-close:hover {
    background: rgba(255, 255, 255, 0.25);
    transform: rotate(90deg);
}

.payment-modal-header h3 {
    font-size: 1.4rem;
    margin: 6px 0 8px;
    color: #f5efe6;
}

.payment-modal-header p {
    font-size: 0.88rem;
    color: rgba(245, 239, 230, 0.75);
    line-height: 1.4;
    margin-bottom: 20px;
}

.payment-qr-frame {
    background: #ffffff;
    padding: 16px;
    border-radius: 16px;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    box-shadow: inset 0 0 10px rgba(0,0,0,0.1), 0 8px 24px rgba(0,0,0,0.3);
    margin: 0 auto 20px;
    max-width: 240px;
    width: 100%;
}

.payment-qr-img {
    width: 100%;
    height: auto;
    max-height: 220px;
    object-fit: contain;
    border-radius: 8px;
    display: block;
}

.pay-badge {
    display: inline-block;
    font-size: 0.8rem;
    padding: 6px 14px;
    border-radius: 20px;
    background: rgba(212, 175, 55, 0.15);
    color: #e6c662;
    border: 1px solid rgba(212, 175, 55, 0.3);
}

.pay-stat-card {
    transition: transform 0.2s ease, box-shadow 0.2s ease;
}
.pay-stat-card:hover {
    transform: translateY(-2px);
    box-shadow: 0 8px 20px rgba(212, 175, 55, 0.2);
}
"""

modal_html = """
    <!-- Payment Scanner / QR Modal -->
    <div id="paymentModal" class="payment-modal-overlay" aria-hidden="true" onclick="if(event.target===this)closePaymentModal()">
        <div class="payment-modal-content" role="dialog" aria-labelledby="paymentModalTitle">
            <button class="payment-modal-close" onclick="closePaymentModal()" aria-label="Close Payment Modal">&times;</button>
            <div class="payment-modal-header">
                <span class="eyebrow" style="color:var(--gold, #d4af37);">ONLINE PAYMENT</span>
                <h3 id="paymentModalTitle">Scan &amp; Pay via QR</h3>
                <p>Scan the code below using any UPI app (Google Pay, PhonePe, Paytm) to complete your payment.</p>
            </div>
            <div class="payment-qr-frame">
                <img src="images/logo.png" alt="Amoura Crafts Payment Scanner QR" class="payment-qr-img" id="paymentQrImg">
            </div>
            <div class="payment-modal-footer">
                <span class="pay-badge">✨ Instant Payment Confirmation</span>
                <button class="btn btn-primary" onclick="closePaymentModal()" style="margin-top:14px; width:100%;">Done / Close</button>
            </div>
        </div>
    </div>
"""

modal_js = """
        /* ================================================================
           ONLINE PAYMENT MODAL
           ================================================================ */
        function openPaymentModal() {
            const modal = document.getElementById("paymentModal");
            if (modal) {
                modal.classList.add("active");
                modal.setAttribute("aria-hidden", "false");
                document.body.style.overflow = "hidden";
            }
        }

        function closePaymentModal() {
            const modal = document.getElementById("paymentModal");
            if (modal) {
                modal.classList.remove("active");
                modal.setAttribute("aria-hidden", "true");
                document.body.style.overflow = "";
            }
        }

        document.addEventListener("keydown", function (e) {
            if (e.key === "Escape") closePaymentModal();
        });
"""

def update_file(filename):
    filepath = os.path.join(workspace, filename)
    with open(filepath, "r", encoding="utf-8") as f:
        content = f.read()

    # 1. Remove COD from stat
    content = content.replace(
        '<div class="stat"><b>COD</b><span>&amp; online payment</span></div>',
        '<div class="stat pay-stat-card" id="onlinePaymentCard" style="cursor:pointer;" onclick="openPaymentModal()" title="Click to view Online Payment QR Scanner"><b>Online Payment</b><span>Scan QR code</span></div>'
    )

    # 2. Remove COD from features heading & text
    content = content.replace(
        '<h4>COD &amp; online pay</h4>',
        '<h4 style="cursor:pointer;" onclick="openPaymentModal()">Online Payment</h4>'
    )
    content = content.replace(
        'Pay cash on delivery, or settle instantly by UPI once we confirm on WhatsApp.',
        'Settle instantly via UPI or QR code scan after confirming your order on WhatsApp.'
    )

    # 3. Remove Cash on Delivery chip
    content = content.replace(
        '<div class="pay-chip"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6"><path d="M3 7l9 6 9-6" /><rect x="3" y="5" width="18" height="14" rx="2" /></svg> Cash on Delivery</div>',
        '<div class="pay-chip" style="cursor:pointer;" onclick="openPaymentModal()"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6"><rect x="3" y="5" width="18" height="14" rx="2"/><path d="M3 10h18"/><path d="M7 15h2"/></svg> Online Payment</div>'
    )

    # 4. Remove COD from WhatsApp strings
    content = content.replace('payment options (COD / online)', 'Online Payment details')
    content = content.replace('COD / online', 'Online Payment')

    # 5. Inject CSS before </head> if not present
    if '.payment-modal-overlay' not in content:
        content = content.replace('</head>', f'<style>\n{modal_css}\n</style>\n</head>')

    # 6. Inject Modal HTML before </body> if not present
    if 'id="paymentModal"' not in content:
        content = content.replace('</body>', f'{modal_html}\n</body>')

    # 7. Inject JS before </body> (or inside <script>)
    if 'function openPaymentModal()' not in content:
        content = content.replace('</script>\n</body>', f'{modal_js}\n</script>\n</body>')
        if 'function openPaymentModal()' not in content:
            content = content.replace('</body>', f'<script>\n{modal_js}\n</script>\n</body>')

    with open(filepath, "w", encoding="utf-8") as f:
        f.write(content)
    print(f"Successfully updated {filename}")

update_file("index.html")
update_file("plants.html")
print("Payment section update complete.")
