import React, { useEffect } from 'react';
import confetti from 'canvas-confetti';
import { CheckCircle2, Download, MessageCircle, X, Sparkles, FileText } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { formatINR } from '../utils/formatters';
import { generateInvoicePdf } from '../utils/invoiceGenerator';
import { openWhatsApp, buildCustomerWhatsAppMessage } from '../utils/whatsapp';

export default function InvoiceModal() {
  const { isInvoiceOpen, closeInvoice, completedOrder } = useCart();

  useEffect(() => {
    if (isInvoiceOpen) {
      // Festive Confetti burst
      try {
        confetti({
          particleCount: 80,
          spread: 70,
          origin: { y: 0.6 },
          colors: ['#d4af37', '#f4dd8e', '#c96a12', '#210810']
        });
      } catch (e) {}
    }
  }, [isInvoiceOpen]);

  if (!isInvoiceOpen || !completedOrder) return null;

  const handleDownloadInvoice = () => {
    generateInvoicePdf(completedOrder);
  };

  const handleOpenWhatsApp = () => {
    const msg = buildCustomerWhatsAppMessage(completedOrder);
    openWhatsApp(msg);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 overflow-y-auto bg-black/85 backdrop-blur-md animate-fadeIn">
      <div className="relative w-full max-w-lg bg-amoura-card border border-amoura-gold/50 rounded-2xl shadow-gold-glow overflow-hidden my-6 text-center">
        
        {/* Confetti / Festive Header */}
        <div className="bg-gradient-to-r from-amoura-maroon-950 via-amoura-maroon-900 to-amoura-maroon-950 p-6 sm:p-8 border-b border-amoura-line relative">
          <button
            onClick={closeInvoice}
            className="absolute top-4 right-4 p-1.5 rounded-lg text-amoura-muted hover:text-amoura-cream hover:bg-amoura-card transition-colors"
            aria-label="Close"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="w-16 h-16 rounded-full bg-amoura-gold/20 border-2 border-amoura-gold flex items-center justify-center mx-auto mb-3 shadow-gold-glow">
            <CheckCircle2 className="w-9 h-9 text-amoura-gold" />
          </div>

          <span className="inline-flex items-center gap-1.5 text-xs uppercase tracking-widest text-amoura-gold font-bold mb-1">
            <Sparkles className="w-3.5 h-3.5" /> Order Confirmed
          </span>

          <h2 className="font-display text-2xl sm:text-3xl font-bold text-amoura-cream">
            Thank You for Your Order!
          </h2>
          <p className="text-xs text-amoura-cream-dim mt-1 max-w-sm mx-auto">
            Your handcrafted order has been received by Amoura Crafts. We are preparing it with love.
          </p>
        </div>

        {/* Order Details Summary */}
        <div className="p-6 space-y-4 text-left">
          
          <div className="p-4 rounded-xl bg-amoura-dark border border-amoura-line space-y-2 text-xs">
            <div className="flex justify-between">
              <span className="text-amoura-muted">Order ID:</span>
              <span className="font-bold text-amoura-cream">{completedOrder.orderId}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-amoura-muted">Invoice Number:</span>
              <span className="font-bold text-amoura-gold">{completedOrder.invoiceNumber}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-amoura-muted">Customer Name:</span>
              <span className="text-amoura-cream">{completedOrder.customerName}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-amoura-muted">Preferred Color:</span>
              <span className="text-amoura-gold-light">{completedOrder.preferredColor || "Default"}</span>
            </div>
            <div className="flex justify-between pt-2 border-t border-amoura-line/60 text-sm font-bold text-amoura-gold">
              <span>Total Amount:</span>
              <span className="font-display text-base">{formatINR(completedOrder.finalTotal)}</span>
            </div>
          </div>

          <div className="space-y-2.5 pt-2">
            <button
              onClick={handleDownloadInvoice}
              className="w-full py-3.5 px-4 rounded-xl font-semibold text-xs sm:text-sm bg-gradient-to-r from-amoura-gold via-amoura-gold-light to-amoura-gold-dark text-amoura-dark hover:shadow-gold-glow flex items-center justify-center gap-2 transition-all cursor-pointer"
            >
              <Download className="w-4 h-4" />
              <span>Download PDF Invoice</span>
            </button>

            <button
              onClick={handleOpenWhatsApp}
              className="w-full py-3 px-4 rounded-xl font-semibold text-xs sm:text-sm bg-amoura-bg border border-amoura-line text-amoura-cream hover:text-amoura-gold hover:border-amoura-gold flex items-center justify-center gap-2 transition-colors cursor-pointer"
            >
              <MessageCircle className="w-4 h-4 text-green-500" />
              <span>Chat on WhatsApp</span>
            </button>

            <button
              onClick={closeInvoice}
              className="w-full py-2.5 text-xs text-amoura-muted hover:text-amoura-cream transition-colors"
            >
              Back to Home &amp; Continue Shopping
            </button>
          </div>

        </div>

      </div>
    </div>
  );
}
