import { jsPDF } from 'jspdf';
import { formatINR } from './formatters';

export function generateInvoicePdf(order) {
  try {
    const doc = new jsPDF({ unit: "pt", format: "a4" });
    let y = 56;
    const margin = 42;

    // Header Branding
    doc.setFont("helvetica", "bold");
    doc.setFontSize(22);
    doc.setTextColor(190, 140, 40); // Gold tone
    doc.text("AMOURA CRAFTS", margin, y);
    y += 18;

    doc.setFont("helvetica", "normal");
    doc.setFontSize(10);
    doc.setTextColor(120, 120, 120);
    doc.text("Luxury Handcrafted Soy Candles & Resin Art | amouracrafts.com", margin, y);
    y += 24;

    // Divider line
    doc.setDrawColor(212, 175, 55);
    doc.setLineWidth(1);
    doc.line(margin, y, 550, y);
    y += 24;

    // Invoice Info
    doc.setFontSize(10);
    doc.setTextColor(60, 60, 60);
    doc.text(`Invoice No: ${order.invoiceNumber || 'INV-' + order.orderId}`, margin, y);
    doc.text(`Order Date: ${new Date(order.orderDate || Date.now()).toLocaleDateString("en-IN")}`, 380, y);
    y += 16;
    doc.text(`Order ID: ${order.orderId}`, margin, y);
    doc.text(`Payment Status: ${order.paymentStatus || 'Pending'}`, 380, y);
    y += 26;

    // Customer Block
    doc.setFont("helvetica", "bold");
    doc.setFontSize(12);
    doc.setTextColor(34, 28, 22);
    doc.text("BILLED TO / SHIPPING ADDRESS", margin, y);
    y += 18;

    doc.setFont("helvetica", "normal");
    doc.setFontSize(10);
    doc.setTextColor(60, 60, 60);
    doc.text(`Name: ${order.customerName}`, margin, y);
    y += 14;
    doc.text(`Mobile: ${order.customerPhone}`, margin, y);
    if (order.customerEmail) {
      y += 14;
      doc.text(`Email: ${order.customerEmail}`, margin, y);
    }
    y += 14;
    doc.text(`Address: ${order.address}, ${order.city}, ${order.state} - ${order.pincode}`, margin, y);
    y += 14;
    doc.text(`Preferred Color: ${order.preferredColor || "Default"}`, margin, y);
    y += 26;

    // Items Table Header
    doc.setFillColor(248, 243, 235);
    doc.rect(margin, y, 508, 22, 'F');
    doc.setFont("helvetica", "bold");
    doc.setFontSize(10);
    doc.setTextColor(50, 40, 30);
    doc.text("Item Description", margin + 8, y + 15);
    doc.text("Qty", 320, y + 15);
    doc.text("Price", 390, y + 15);
    doc.text("Total", 475, y + 15);
    y += 28;

    // Items
    doc.setFont("helvetica", "normal");
    doc.setTextColor(60, 60, 60);
    (order.items || []).forEach((item) => {
      const qty = item.quantity || item.qty || 1;
      const price = Number(item.price || item.unitPrice || 0);
      const total = qty * price;
      
      const title = (item.name || item.productName || 'Product').substring(0, 42);
      doc.text(title, margin + 8, y);
      doc.text(String(qty), 325, y);
      doc.text(formatINR(price), 390, y);
      doc.text(formatINR(total), 475, y);
      y += 20;
    });

    y += 10;
    doc.setDrawColor(220, 220, 220);
    doc.line(margin, y, 550, y);
    y += 20;

    // Summary Totals
    const rightCol = 380;
    doc.text("Subtotal:", rightCol, y);
    doc.text(formatINR(order.subtotal), 475, y);
    y += 16;

    doc.text("Shipping:", rightCol, y);
    doc.text(order.shipping === 0 ? "FREE" : formatINR(order.shipping), 475, y);
    y += 18;

    doc.setFont("helvetica", "bold");
    doc.setFontSize(12);
    doc.setTextColor(190, 140, 40);
    doc.text("Grand Total:", rightCol, y);
    doc.text(formatINR(order.finalTotal), 475, y);
    y += 35;

    // Footer note
    doc.setFont("helvetica", "normal");
    doc.setFontSize(9);
    doc.setTextColor(120, 120, 120);
    doc.text("Thank you for supporting hand-poured artisan craftsmanship!", margin, y);
    y += 12;
    doc.text("Contact: craftsamoura@gmail.com | WhatsApp: +91 87006 89036 | amouracrafts.com", margin, y);

    doc.save(`${order.invoiceNumber || 'amoura-invoice'}.pdf`);
    return true;
  } catch (err) {
    console.error("Failed to generate PDF invoice:", err);
    return false;
  }
}
