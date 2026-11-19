import React, { useEffect } from 'react';
import confetti from 'canvas-confetti';
import { CheckCircle2, Download, MessageCircle, X, Sparkles } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { formatINR } from '../utils/formatters';
import { generateInvoicePdf } from '../utils/invoiceGenerator';
import { openWhatsApp, buildCustomerWhatsAppMessage } from '../utils/whatsapp';

export default function InvoiceModal() {
  const { isInvoiceOpen, closeInvoice, completedOrder } = useCart();

  useEffect(() => {
    if (isInvoiceOpen) {
      try {
        confetti({
          particleCount: 90,
          spread: 70,
          origin: { y: 0.6 },
          colors: ['#344638', '#89977C', '#C47D5A', '#EFE8DC']
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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 overflow-y-auto bg-amoura-charcoal/70 backdrop-blur-sm animate-fadeIn">
      <div className="relative w-full max-w-lg bg-white border border-amoura-border rounded-2xl shadow-elevated overflow-hidden my-6 text-center">
        
        {/* Festive Header */}
        <div className="bg-amoura-cream p-6 sm:p-8 border-b border-amoura-border relative">
          <button
            onClick={closeInvoice}
            className="absolute top-4 right-4 p-1.5 rounded-lg text-amoura-muted hover:text-amoura-charcoal transition-colors cursor-pointer"
            aria-label="Close"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="w-16 h-16 rounded-full bg-amoura-forest/10 border-2 border-amoura-forest flex items-center justify-center mx-auto mb-3 shadow-sm">
            <CheckCircle2 className="w-9 h-9 text-amoura-forest" />
          </div>

          <span className="inline-flex items-center gap-1.5 text-xs uppercase tracking-widest text-amoura-forest font-bold mb-1">
            <Sparkles className="w-3.5 h-3.5 text-amoura-terracotta" /> Order Placed Successfully
          </span>

          <h2 className="font-serif text-2xl sm:text-3xl font-bold text-amoura-charcoal">
            Thank You for Your Order!
          </h2>
          <p className="text-xs text-amoura-muted mt-1 max-w-sm mx-auto">
            Your handcrafted creations are being prepared by Amoura Crafts with love and devotion.
          </p>
        </div>

        {/* Order Details Summary */}
        <div className="p-6 space-y-4 text-left">
          
          <div className="p-4 rounded-xl bg-amoura-ivory border border-amoura-border space-y-2 text-xs">
            <div className="flex justify-between">
              <span className="text-amoura-muted">Order ID:</span>
              <span className="font-bold text-amoura-charcoal">{completedOrder.orderId}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-amoura-muted">Invoice Number:</span>
              <span className="font-bold text-amoura-forest">{completedOrder.invoiceNumber}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-amoura-muted">Customer Name:</span>
              <span className="text-amoura-charcoal">{completedOrder.customerName}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-amoura-muted">Selected Shade:</span>
              <span className="text-amoura-forest font-semibold">{completedOrder.preferredColor || "Default"}</span>
            </div>
            <div className="flex justify-between pt-2 border-t border-amoura-border text-sm font-bold text-amoura-charcoal">
              <span>Total Amount:</span>
              <span className="font-serif text-base text-amoura-forest">{formatINR(completedOrder.finalTotal)}</span>
            </div>
          </div>

          <div className="space-y-2.5 pt-2">
            <button
              onClick={handleDownloadInvoice}
              className="w-full py-3.5 px-4 rounded-xl font-semibold text-xs sm:text-sm bg-amoura-forest text-amoura-ivory hover:bg-amoura-charcoal flex items-center justify-center gap-2 transition-all shadow-sm cursor-pointer"
            >
              <Download className="w-4 h-4" />
              <span>Download Official PDF Invoice</span>
            </button>

            <button
              onClick={handleOpenWhatsApp}
              className="w-full py-3 px-4 rounded-xl font-semibold text-xs sm:text-sm bg-amoura-cream border border-amoura-border text-amoura-charcoal hover:border-amoura-forest flex items-center justify-center gap-2 transition-colors cursor-pointer"
            >
              <MessageCircle className="w-4 h-4 text-amoura-forest" />
              <span>Chat with Founder on WhatsApp</span>
            </button>

            <button
              onClick={closeInvoice}
              className="w-full py-2.5 text-xs text-amoura-muted hover:text-amoura-charcoal transition-colors cursor-pointer"
            >
              Back to Home &amp; Continue Shopping
            </button>
          </div>

        </div>

      </div>
    </div>
  );
}
