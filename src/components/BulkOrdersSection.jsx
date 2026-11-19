import React from 'react';
import { Gift, Sparkles, MessageCircle, CheckCircle, Package } from 'lucide-react';
import { openWhatsApp } from '../utils/whatsapp';

export default function BulkOrdersSection() {
  const handleBulkInquiry = () => {
    openWhatsApp('Hi Amoura Crafts! We are interested in bulk candle orders for corporate gifting / wedding favors. Please share your catalog and bulk pricing! ✨');
  };

  return (
    <section id="bulk-orders" className="py-16 sm:py-24 bg-white border-t border-amoura-border">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="rounded-3xl bg-amoura-cream/60 border border-amoura-border p-8 sm:p-12 lg:p-16 shadow-soft">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
            
            <div className="lg:col-span-7 space-y-5 text-center lg:text-left">
              <span className="text-xs uppercase tracking-widest text-amoura-sage-dark font-bold flex items-center justify-center lg:justify-start gap-1.5">
                <Gift className="w-4 h-4 text-amoura-terracotta" /> Bespoke Gifting &amp; Festivities
              </span>

              <h2 className="font-serif text-3xl sm:text-4xl md:text-5xl font-semibold text-amoura-charcoal leading-tight">
                Bulk Orders &amp; Wedding Favors
              </h2>

              <p className="text-xs sm:text-sm text-amoura-muted leading-relaxed max-w-xl mx-auto lg:mx-0">
                Delight your wedding guests, corporate clients, and loved ones with customized hand-poured soy candles and resin plaques. Choose bespoke color palettes, customized labels, and luxury festive packaging.
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-left pt-2">
                <div className="flex items-center gap-2 text-xs font-semibold text-amoura-charcoal">
                  <CheckCircle className="w-4 h-4 text-amoura-forest flex-shrink-0" />
                  <span>Custom Color Matching</span>
                </div>
                <div className="flex items-center gap-2 text-xs font-semibold text-amoura-charcoal">
                  <CheckCircle className="w-4 h-4 text-amoura-forest flex-shrink-0" />
                  <span>Curated Aromas</span>
                </div>
                <div className="flex items-center gap-2 text-xs font-semibold text-amoura-charcoal">
                  <CheckCircle className="w-4 h-4 text-amoura-forest flex-shrink-0" />
                  <span>Pan-India Safe Dispatch</span>
                </div>
              </div>

              <div className="pt-3">
                <button
                  onClick={handleBulkInquiry}
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-2.5 px-8 py-3.5 rounded-full font-semibold text-xs sm:text-sm bg-amoura-forest text-amoura-ivory hover:bg-amoura-charcoal transition-all shadow-sm cursor-pointer"
                >
                  <MessageCircle className="w-4 h-4" />
                  <span>Discuss Bulk Requirements on WhatsApp</span>
                </button>
              </div>
            </div>

            <div className="lg:col-span-5">
              <div className="rounded-2xl overflow-hidden border border-amoura-border shadow-elevated bg-white aspect-[4/3]">
                <img
                  src="/images/thumbs/img_22.webp"
                  alt="Customized Bulk Gifting Amoura Crafts"
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    e.target.onerror = null;
                    e.target.src = '/image/Velvet Heart Luxe Candle 650.jpg';
                  }}
                />
              </div>
            </div>

          </div>
        </div>

      </div>
    </section>
  );
}
