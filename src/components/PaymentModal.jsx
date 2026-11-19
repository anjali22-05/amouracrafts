import React, { useState } from 'react';
import { X, ShieldCheck, QrCode, ArrowLeft, CheckCircle2, Copy, Check } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { formatINR } from '../utils/formatters';
import { openWhatsApp, buildAdminWhatsAppMessage } from '../utils/whatsapp';
import { generateInvoicePdf } from '../utils/invoiceGenerator';

export default function PaymentModal() {
  const { isPaymentOpen, closePayment, currentOrder, completeOrder } = useCart();
  const [transactionId, setTransactionId] = useState('');
  const [copiedAmount, setCopiedAmount] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  if (!isPaymentOpen || !currentOrder) return null;

  const handleCopyAmount = () => {
    navigator.clipboard.writeText(String(currentOrder.finalTotal));
    setCopiedAmount(true);
    setTimeout(() => setCopiedAmount(false), 1800);
  };

  const handleConfirmOrder = (e) => {
    e.preventDefault();
    setSubmitting(true);

    const finalOrder = {
      ...currentOrder,
      transactionId: transactionId.trim() || 'PAYMENT-VERIFY-PENDING',
      paymentStatus: transactionId.trim() ? 'Under Verification' : 'Confirmation Pending',
      orderStatus: 'Placed & In Process'
    };

    // 1. Send Order notification via WhatsApp
    try {
      const adminMsg = buildAdminWhatsAppMessage(finalOrder);
      openWhatsApp(adminMsg);
    } catch (err) {
      console.warn("WhatsApp open trigger:", err);
    }

    // 2. Automatically generate and download official PDF invoice
    try {
      generateInvoicePdf(finalOrder);
    } catch (err) {
      console.warn("Invoice generation warning:", err);
    }

    // 3. Complete order and show confirmation modal
    setTimeout(() => {
      setSubmitting(false);
      completeOrder(finalOrder);
    }, 600);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 overflow-y-auto bg-black/85 backdrop-blur-md animate-fadeIn">
      <div className="relative w-full max-w-lg bg-amoura-card border border-amoura-line rounded-2xl shadow-2xl overflow-hidden my-6">
        
        {/* Header */}
        <div className="p-4 sm:p-5 border-b border-amoura-line bg-amoura-bg flex items-center justify-between">
          <div className="flex items-center gap-2">
            <QrCode className="w-5 h-5 text-amoura-gold" />
            <div>
              <h2 className="font-display text-lg sm:text-xl font-bold text-amoura-cream">
                Scan &amp; Pay via UPI
              </h2>
              <p className="text-[11px] text-amoura-muted">Step 2 of 2: Scan QR to complete payment</p>
            </div>
          </div>
          <button
            onClick={closePayment}
            className="p-1.5 rounded-lg text-amoura-muted hover:text-amoura-cream hover:bg-amoura-card transition-colors"
            aria-label="Close Payment Modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleConfirmOrder} className="p-4 sm:p-6 space-y-5">
          
          {/* Payable Amount Highlight */}
          <div className="p-3.5 rounded-xl bg-amoura-dark border border-amoura-line flex items-center justify-between">
            <div>
              <span className="text-[11px] text-amoura-muted block">Total Payable Amount:</span>
              <span className="font-display text-2xl font-bold text-amoura-gold">
                {formatINR(currentOrder.finalTotal)}
              </span>
            </div>
            <button
              type="button"
              onClick={handleCopyAmount}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-amoura-card border border-amoura-line text-amoura-cream hover:text-amoura-gold transition-colors"
            >
              {copiedAmount ? (
                <>
                  <Check className="w-3.5 h-3.5 text-emerald-400" />
                  <span className="text-emerald-400">Copied</span>
                </>
              ) : (
                <>
                  <Copy className="w-3.5 h-3.5" />
                  <span>Copy Amount</span>
                </>
              )}
            </button>
          </div>

          {/* QR Code Presentation */}
          <div className="flex flex-col items-center text-center space-y-3">
            <div className="p-3 bg-white rounded-2xl shadow-xl border-4 border-amoura-gold/40 flex items-center justify-center max-w-[260px] sm:max-w-[280px]">
              <img
                src="/images/payment.jpeg"
                alt="Amoura Crafts UPI Payment QR Code"
                className="w-full h-auto object-contain rounded-lg"
                loading="eager"
              />
            </div>

            <p className="text-xs text-amoura-cream-dim max-w-xs">
              Scan with Google Pay, PhonePe, Paytm, BHIM, or any UPI App to pay securely.
            </p>
          </div>

          {/* Transaction / UTR Input */}
          <div className="space-y-1.5">
            <label className="block text-xs font-medium text-amoura-cream">
              UPI Transaction ID / UTR Number
            </label>
            <input
              type="text"
              placeholder="e.g. 12-digit UPI Ref Number (Optional)"
              value={transactionId}
              onChange={(e) => setTransactionId(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl bg-amoura-bg border border-amoura-line text-xs text-amoura-cream placeholder-amoura-muted focus:outline-none focus:border-amoura-gold"
            />
            <p className="text-[11px] text-amoura-muted">
              Entering the UTR speeds up instant dispatch verification.
            </p>
          </div>

          {/* Action Buttons */}
          <div className="pt-2 space-y-2.5">
            <button
              type="submit"
              disabled={submitting}
              className="w-full py-3.5 px-4 rounded-xl font-semibold text-sm bg-gradient-to-r from-amoura-gold via-amoura-gold-light to-amoura-gold-dark text-amoura-dark hover:shadow-gold-glow flex items-center justify-center gap-2 transition-all duration-200 cursor-pointer disabled:opacity-75"
            >
              <CheckCircle2 className="w-4 h-4" />
              <span>{submitting ? 'Confirming Order...' : 'Confirm Order & Send to WhatsApp'}</span>
            </button>

            <button
              type="button"
              onClick={closePayment}
              className="w-full py-2.5 px-4 rounded-xl text-xs font-medium text-amoura-subtext hover:text-amoura-cream flex items-center justify-center gap-1.5 transition-colors"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Change Address Details</span>
            </button>
          </div>

          {/* Security Assurance */}
          <div className="pt-2 border-t border-amoura-line/60 flex items-center justify-center gap-2 text-[11px] text-amoura-muted">
            <ShieldCheck className="w-4 h-4 text-amoura-gold" />
            <span>100% Secure UPI Transaction • Direct Studio Verification</span>
          </div>

        </form>

      </div>
    </div>
  );
}
