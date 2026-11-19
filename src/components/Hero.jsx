import React from 'react';
import { ArrowRight, Sparkles, Leaf, ShieldCheck, Heart } from 'lucide-react';
import { openWhatsApp } from '../utils/whatsapp';

export default function Hero({ onShopClick, onExploreClick }) {
  return (
    <section className="relative overflow-hidden bg-amoura-ivory pt-10 pb-16 lg:pt-16 lg:pb-24 border-b border-amoura-border">
      
      {/* Subtle organic light gradient */}
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-amoura-sage/10 rounded-full blur-[140px] pointer-events-none -z-0" />
      <div className="absolute bottom-0 left-0 w-[450px] h-[450px] bg-amoura-terracotta/8 rounded-full blur-[120px] pointer-events-none -z-0" />

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
          
          {/* Left Column: Editorial Headline & Narrative */}
          <div className="lg:col-span-7 space-y-6 text-center lg:text-left">
            
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-amoura-cream border border-amoura-border text-amoura-forest text-xs font-semibold uppercase tracking-wider shadow-sm">
              <Leaf className="w-3.5 h-3.5 text-amoura-sage-dark flex-shrink-0" />
              <span>100% Pure Organic Soy Wax &amp; Bespoke Art</span>
            </div>

            <h1 className="font-serif text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-semibold text-amoura-charcoal tracking-tight leading-[1.08]">
              Crafted with Love.<br />
              <span className="italic font-normal text-amoura-forest">Designed to Inspire.</span>
            </h1>

            <p className="text-base sm:text-lg text-amoura-muted max-w-2xl mx-auto lg:mx-0 font-normal leading-relaxed">
              Discover thoughtfully handcrafted candles, resin art and unique creations that bring beauty and warmth into your everyday life.
            </p>

            {/* CTAs */}
            <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4 pt-2">
              <button
                onClick={() => {
                  if (typeof onShopClick === 'function') onShopClick();
                  else {
                    const el = document.getElementById('collection');
                    if (el) el.scrollIntoView({ behavior: 'smooth' });
                  }
                }}
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2.5 px-8 py-3.5 rounded-full font-semibold text-sm bg-amoura-forest text-amoura-ivory hover:bg-amoura-charcoal transition-all shadow-sm hover:shadow-elevated transform hover:-translate-y-0.5 active:translate-y-0 cursor-pointer"
              >
                <span>Shop Collection</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <button
                onClick={() => {
                  if (typeof onExploreClick === 'function') onExploreClick();
                  else {
                    const el = document.getElementById('categories');
                    if (el) el.scrollIntoView({ behavior: 'smooth' });
                  }
                }}
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-7 py-3.5 rounded-full font-semibold text-sm bg-amoura-cream border border-amoura-border text-amoura-forest hover:bg-white transition-all shadow-sm cursor-pointer"
              >
                <span>Explore Our Creations</span>
              </button>
            </div>

            {/* Trust Badges Trio */}
            <div className="pt-6 grid grid-cols-3 gap-3 border-t border-amoura-border/70 max-w-lg mx-auto lg:mx-0">
              <div className="text-center lg:text-left">
                <span className="font-serif block text-2xl sm:text-3xl font-bold text-amoura-forest">100%</span>
                <span className="text-[11px] text-amoura-muted uppercase tracking-wider">Natural Soy</span>
              </div>
              <div className="text-center lg:text-left">
                <span className="font-serif block text-2xl sm:text-3xl font-bold text-amoura-forest">₹1,000+</span>
                <span className="text-[11px] text-amoura-muted uppercase tracking-wider">Free Delivery</span>
              </div>
              <div className="text-center lg:text-left">
                <span className="font-serif block text-2xl sm:text-3xl font-bold text-amoura-forest">5.0 ★</span>
                <span className="text-[11px] text-amoura-muted uppercase tracking-wider">Verified Love</span>
              </div>
            </div>

          </div>

          {/* Right Column: Editorial Visual Showcase */}
          <div className="lg:col-span-5 relative">
            <div className="relative mx-auto max-w-md sm:max-w-lg lg:max-w-none">
              
              <div className="relative rounded-3xl p-2 bg-amoura-cream border border-amoura-border shadow-elevated overflow-hidden group">
                <div className="relative rounded-2xl overflow-hidden bg-amoura-ivory aspect-square">
                  <img
                    src="/images/thumbs/img_19.webp"
                    alt="Amoura Crafts Royal Urli Floral Candle"
                    className="w-full h-full object-cover transform group-hover:scale-104 transition-transform duration-700"
                    onError={(e) => {
                      e.target.onerror = null;
                      e.target.src = '/image/Aurelia Bloom Royal Glden Floral Candle 320.jpg';
                    }}
                  />

                  {/* Editorial Floating Info Card */}
                  <div className="absolute bottom-4 left-4 right-4 p-4 rounded-xl bg-white/95 backdrop-blur-md border border-amoura-border flex items-center justify-between shadow-soft">
                    <div>
                      <span className="text-[10px] uppercase tracking-widest text-amoura-sage-dark font-bold block">
                        Featured Centerpiece
                      </span>
                      <h3 className="font-serif text-lg font-bold text-amoura-charcoal">
                        Royal Urli Floral Diya
                      </h3>
                      <p className="text-[11px] text-amoura-muted">Dried botanicals &amp; natural soy aroma</p>
                    </div>
                    <div className="text-right">
                      <span className="text-base font-bold text-amoura-forest">₹550</span>
                      <span className="text-xs line-through text-amoura-muted block">₹699</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Floating Pill Accent */}
              <div className="absolute -top-3 -right-3 px-4 py-2 rounded-full bg-amoura-forest text-amoura-ivory shadow-lg flex items-center gap-2 text-xs font-semibold">
                <Heart className="w-3.5 h-3.5 text-amoura-terracotta fill-amoura-terracotta" />
                <span>Small Batch Artisan Pours</span>
              </div>

            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
