import React, { useState } from 'react';
import { X, ShieldCheck, MapPin, User, Phone, Mail, Palette, ArrowRight } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { formatINR } from '../utils/formatters';

const COLOR_OPTIONS = [
  "Default / As Shown in Photos",
  "Golden Champagne & Amber",
  "Warm Ivory & Natural White",
  "Royal Rose Pink & Gold Flakes",
  "Lavender Blossom Purple",
  "Sage Green & Botanical Leaves",
  "Deep Crimson & Festive Maroon"
];

export default function CheckoutModal() {
  const { isCheckoutOpen, closeCheckout, cart, subtotal, shippingFee, finalTotal, proceedToPayment } = useCart();

  const [formData, setFormData] = useState({
    fullName: '',
    mobile: '',
    email: '',
    address: '',
    city: '',
    state: '',
    pincode: '',
    preferredColor: COLOR_OPTIONS[0],
    note: ''
  });

  const [error, setError] = useState('');

  if (!isCheckoutOpen) return null;

  const handleChange = (e) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');

    if (!formData.fullName.trim()) {
      setError('Please enter your full name.');
      return;
    }

    const cleanMobile = formData.mobile.replace(/\D/g, '');
    if (cleanMobile.length < 10) {
      setError('Please enter a valid 10-digit mobile number for order updates.');
      return;
    }

    if (!formData.address.trim() || !formData.city.trim() || !formData.state.trim() || !formData.pincode.trim()) {
      setError('Please complete the shipping address fields.');
      return;
    }

    const orderId = 'ORD-' + Date.now().toString(36).toUpperCase() + '-' + Math.random().toString(36).substring(2, 5).toUpperCase();
    const invoiceNumber = 'AC-' + new Date().getFullYear() + '-' + Math.floor(1000 + Math.random() * 9000);

    const orderData = {
      orderId,
      invoiceNumber,
      orderDate: new Date().toISOString(),
      customerName: formData.fullName.trim(),
      customerPhone: cleanMobile,
      customerEmail: formData.email.trim(),
      address: formData.address.trim(),
      city: formData.city.trim(),
      state: formData.state.trim(),
      pincode: formData.pincode.trim(),
      preferredColor: formData.preferredColor,
      notes: formData.note.trim(),
      items: cart,
      subtotal,
      shipping: shippingFee,
      finalTotal,
      paymentMethod: "Online / QR",
      paymentStatus: "Payment Confirmation Pending"
    };

    proceedToPayment(orderData);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 overflow-y-auto bg-black/80 backdrop-blur-sm animate-fadeIn">
      <div className="relative w-full max-w-2xl bg-amoura-card border border-amoura-line rounded-2xl shadow-2xl overflow-hidden my-8">
        
        {/* Header */}
        <div className="p-4 sm:p-6 border-b border-amoura-line bg-amoura-bg flex items-center justify-between">
          <div>
            <h2 className="font-display text-xl sm:text-2xl font-bold text-amoura-cream flex items-center gap-2">
              <ShieldCheck className="w-5 h-5 text-amoura-gold" />
              Delivery &amp; Customer Details
            </h2>
            <p className="text-xs text-amoura-muted mt-0.5">Step 1 of 2: Shipping address &amp; custom color preference</p>
          </div>
          <button
            onClick={closeCheckout}
            className="p-1.5 rounded-lg text-amoura-muted hover:text-amoura-cream hover:bg-amoura-card transition-colors"
            aria-label="Close Checkout"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Error Alert */}
        {error && (
          <div className="mx-6 mt-4 p-3 rounded-xl bg-rose-950/80 border border-rose-500/50 text-rose-200 text-xs font-medium">
            {error}
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-4 sm:p-6 space-y-5 max-h-[75vh] overflow-y-auto">
          
          {/* Customer Personal Info */}
          <div className="space-y-3">
            <h3 className="text-xs font-bold uppercase tracking-wider text-amoura-gold flex items-center gap-1.5">
              <User className="w-3.5 h-3.5" /> Contact Details
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-medium text-amoura-cream mb-1">Full Name *</label>
                <input
                  type="text"
                  name="fullName"
                  required
                  placeholder="e.g. Ananya Sharma"
                  value={formData.fullName}
                  onChange={handleChange}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-amoura-bg border border-amoura-line text-xs text-amoura-cream placeholder-amoura-muted focus:outline-none focus:border-amoura-gold"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-amoura-cream mb-1">WhatsApp / Phone Number *</label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-xs text-amoura-muted font-medium">+91</span>
                  <input
                    type="tel"
                    name="mobile"
                    required
                    maxLength={10}
                    placeholder="10-digit number"
                    value={formData.mobile}
                    onChange={handleChange}
                    className="w-full pl-11 pr-3.5 py-2.5 rounded-xl bg-amoura-bg border border-amoura-line text-xs text-amoura-cream placeholder-amoura-muted focus:outline-none focus:border-amoura-gold"
                  />
                </div>
              </div>
            </div>

            <div>
              <label className="block text-xs font-medium text-amoura-cream mb-1">Email Address (Optional)</label>
              <input
                type="email"
                name="email"
                placeholder="For PDF invoice copy"
                value={formData.email}
                onChange={handleChange}
                className="w-full px-3.5 py-2.5 rounded-xl bg-amoura-bg border border-amoura-line text-xs text-amoura-cream placeholder-amoura-muted focus:outline-none focus:border-amoura-gold"
              />
            </div>
          </div>

          {/* Delivery Address */}
          <div className="space-y-3 pt-2 border-t border-amoura-line/60">
            <h3 className="text-xs font-bold uppercase tracking-wider text-amoura-gold flex items-center gap-1.5">
              <MapPin className="w-3.5 h-3.5" /> Shipping Address
            </h3>

            <div>
              <label className="block text-xs font-medium text-amoura-cream mb-1">Street Address / House No / Landmark *</label>
              <textarea
                name="address"
                required
                rows={2}
                placeholder="Flat/House No, Building, Street, Area"
                value={formData.address}
                onChange={handleChange}
                className="w-full px-3.5 py-2 rounded-xl bg-amoura-bg border border-amoura-line text-xs text-amoura-cream placeholder-amoura-muted focus:outline-none focus:border-amoura-gold"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div>
                <label className="block text-xs font-medium text-amoura-cream mb-1">City *</label>
                <input
                  type="text"
                  name="city"
                  required
                  placeholder="City"
                  value={formData.city}
                  onChange={handleChange}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-amoura-bg border border-amoura-line text-xs text-amoura-cream placeholder-amoura-muted focus:outline-none focus:border-amoura-gold"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-amoura-cream mb-1">State *</label>
                <input
                  type="text"
                  name="state"
                  required
                  placeholder="State"
                  value={formData.state}
                  onChange={handleChange}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-amoura-bg border border-amoura-line text-xs text-amoura-cream placeholder-amoura-muted focus:outline-none focus:border-amoura-gold"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-amoura-cream mb-1">PIN Code *</label>
                <input
                  type="text"
                  name="pincode"
                  required
                  maxLength={6}
                  placeholder="6-digit PIN"
                  value={formData.pincode}
                  onChange={handleChange}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-amoura-bg border border-amoura-line text-xs text-amoura-cream placeholder-amoura-muted focus:outline-none focus:border-amoura-gold"
                />
              </div>
            </div>
          </div>

          {/* Preferred Color & Customization */}
          <div className="space-y-3 pt-2 border-t border-amoura-line/60">
            <h3 className="text-xs font-bold uppercase tracking-wider text-amoura-gold flex items-center gap-1.5">
              <Palette className="w-3.5 h-3.5" /> Custom Color Preference
            </h3>

            <div>
              <label className="block text-xs font-medium text-amoura-cream mb-1">Select Custom Shade for Your Handcrafted Items</label>
              <select
                name="preferredColor"
                value={formData.preferredColor}
                onChange={handleChange}
                className="w-full px-3.5 py-2.5 rounded-xl bg-amoura-bg border border-amoura-line text-xs text-amoura-cream focus:outline-none focus:border-amoura-gold"
              >
                {COLOR_OPTIONS.map((opt) => (
                  <option key={opt} value={opt} className="bg-amoura-dark text-amoura-cream">
                    {opt}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-medium text-amoura-cream mb-1">Special Gift Message / Custom Instructions (Optional)</label>
              <input
                type="text"
                name="note"
                placeholder="e.g. 'Please pack as Diwali gift with card for Priya'"
                value={formData.note}
                onChange={handleChange}
                className="w-full px-3.5 py-2 rounded-xl bg-amoura-bg border border-amoura-line text-xs text-amoura-cream placeholder-amoura-muted focus:outline-none focus:border-amoura-gold"
              />
            </div>
          </div>

          {/* Pricing Preview */}
          <div className="p-3.5 rounded-xl bg-amoura-bg border border-amoura-line flex items-center justify-between text-xs">
            <div>
              <span className="text-amoura-muted block">Total Payable:</span>
              <span className="font-display text-xl font-bold text-amoura-gold">{formatINR(finalTotal)}</span>
            </div>
            <div className="text-right text-[11px] text-amoura-subtext">
              <span>{cart.length} item(s)</span> • <span>Shipping: {shippingFee === 0 ? 'FREE' : formatINR(shippingFee)}</span>
            </div>
          </div>

          {/* Submit */}
          <button
            type="submit"
            className="w-full py-3.5 px-4 rounded-xl font-semibold text-sm bg-gradient-to-r from-amoura-gold via-amoura-gold-light to-amoura-gold-dark text-amoura-dark hover:shadow-gold-glow flex items-center justify-center gap-2 transition-all duration-200 cursor-pointer"
          >
            <span>Continue to Payment</span>
            <ArrowRight className="w-4 h-4" />
          </button>

        </form>

      </div>
    </div>
  );
}
