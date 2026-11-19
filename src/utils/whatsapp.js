export const SITE_CONFIG = {
  phone: "918700689036",
  phoneFormatted: "+91 87006 89036",
  email: "craftsamoura@gmail.com",
  adminWhatsAppNumber: "918700689036",
  qrImage: "/images/payment.jpeg",
  orderStorageKey: "amouraCraftsOrders"
};

export function normalizeWhatsAppNumber(phone) {
  if (!phone) return SITE_CONFIG.phone;
  const digits = String(phone).replace(/\D/g, "");
  if (digits.length === 10) return "91" + digits;
  if (digits.length === 12 && digits.startsWith("91")) return digits;
  return digits || SITE_CONFIG.phone;
}

export function openWhatsApp(message, phoneNumber = SITE_CONFIG.phone) {
  const normalized = normalizeWhatsAppNumber(phoneNumber);
  const encoded = encodeURIComponent(message);
  const url = `https://wa.me/${normalized}?text=${encoded}`;
  window.open(url, '_blank');
}

export function buildCustomerWhatsAppMessage(order) {
  const itemList = (order.items || []).map((item, index) => {
    const qty = item.quantity || item.qty || 1;
    const price = item.price || item.unitPrice || 0;
    return `${index + 1}. ${item.name || item.productName} × ${qty} — ₹${price * qty}`;
  }).join("\n");

  return [
    "✨ AMOURA CRAFTS — ORDER CONFIRMATION ✨",
    "",
    `Order ID: ${order.orderId}`,
    `Invoice No: ${order.invoiceNumber}`,
    `Date: ${new Date(order.orderDate || Date.now()).toLocaleString("en-IN", { dateStyle: "medium", timeStyle: "short" })}`,
    "",
    "Customer Details:",
    `Name: ${order.customerName}`,
    `Phone: ${order.customerPhone}`,
    `Address: ${order.address}, ${order.city}, ${order.state} - ${order.pincode}`,
    `Preferred Color: ${order.preferredColor || "Default"}`,
    "",
    "Items Ordered:",
    itemList,
    "",
    `Subtotal: ₹${order.subtotal}`,
    `Shipping: ${order.shipping === 0 ? "FREE" : `₹${order.shipping}`}`,
    `Total Amount: ₹${order.finalTotal}`,
    `Payment Method: ${order.paymentMethod || "Online / QR"}`,
    `Payment Status: ${order.paymentStatus || "Payment Confirmation Pending"}`,
    `Transaction ID / UTR: ${order.transactionId || "N/A"}`,
    "",
    "Thank you for ordering handcrafted creations from Amoura Crafts! 🕯️💫"
  ].join("\n");
}

export function buildAdminWhatsAppMessage(order) {
  const items = (order.items || []).map((item, index) => {
    const qty = item.quantity || item.qty || 1;
    const unitPrice = Number(item.price || item.unitPrice || 0);
    const total = unitPrice * qty;
    return `${index + 1}. ${item.name || item.productName}\n   Quantity: ${qty}\n   Unit Price: ₹${unitPrice}\n   Item Total: ₹${total}`;
  }).join("\n\n");

  const customerPhone = order.customerPhone || "N/A";
  const transactionId = order.transactionId || "N/A";

  return [
    "🔔 NEW ORDER RECEIVED — AMOURA CRAFTS",
    "",
    "━━━━━━━━━━━━━━━━━━",
    "ORDER DETAILS",
    `Order ID: ${order.orderId}`,
    `Invoice No: ${order.invoiceNumber}`,
    `Order Date: ${new Date(order.orderDate || Date.now()).toLocaleString("en-IN", { day: "2-digit", month: "short", year: "numeric", hour: "2-digit", minute: "2-digit" })}`,
    "",
    "━━━━━━━━━━━━━━━━━━",
    "CUSTOMER DETAILS",
    `Name: ${order.customerName || "N/A"}`,
    `Mobile: ${customerPhone}`,
    `Email: ${order.customerEmail || "N/A"}`,
    `Preferred Color: ${order.preferredColor || "Default"}`,
    "",
    "Delivery Address:",
    `${order.address || "N/A"}`,
    `${order.city || "N/A"}, ${order.state || "N/A"} - ${order.pincode || "N/A"}`,
    "",
    "━━━━━━━━━━━━━━━━━━",
    "ORDER ITEMS",
    items,
    "",
    "━━━━━━━━━━━━━━━━━━",
    "PAYMENT & TOTAL",
    `Payment Method: ${order.paymentMethod || "Online / QR"}`,
    `Amount: ₹${order.finalTotal}`,
    `Payment Status: ${order.paymentStatus || "Payment Confirmation Pending"}`,
    `Transaction ID / UTR: ${transactionId}`,
    `Subtotal: ₹${order.subtotal}`,
    `Shipping: ${order.shipping === 0 ? "FREE" : `₹${order.shipping}`}`,
    `TOTAL PAYABLE: ₹${order.finalTotal}`,
    "",
    "━━━━━━━━━━━━━━━━━━",
    `Customer Notes: ${order.notes || "None"}`
  ].join("\n");
}
