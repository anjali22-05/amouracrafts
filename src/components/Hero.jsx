import React from 'react';
import { Sparkles, MessageCircle, ArrowRight, ShieldCheck, Flame } from 'lucide-react';
import { openWhatsApp } from '../utils/whatsapp';

export default function Hero({ onExploreClick }) {
  return (
    <section className="relative overflow-hidden bg-amoura-bg pt-10 pb-16 lg:pt-16 lg:pb-24 border-b border-amoura-line">
      {/* Subtle Golden Glow Accents */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[350px] bg-amoura-gold/10 rounded-full blur-[120px] pointer-events-none -z-0"></div>
      <div className="absolute -top-24 -left-24 w-96 h-96 bg-amoura-maroon-900/30 rounded-full blur-[100px] pointer-events-none -z-0"></div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
          
          {/* Left Column: Headlines & Call to Actions */}
          <div className="lg:col-span-7 space-y-6 text-center lg:text-left">
            
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-amoura-card border border-amoura-line text-amoura-gold text-xs font-semibold tracking-wider uppercase shadow-sm">
              <Flame className="w-3.5 h-3.5 text-amoura-gold fill-amoura-gold animate-pulse" />
              <span>Artisan Hand-Poured Luxury Studio</span>
            </div>

            <h1 className="font-display text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-amoura-cream tracking-tight leading-[1.15]">
              Handcrafted <span className="bg-gradient-to-r from-amoura-gold via-amoura-gold-light to-amber-500 bg-clip-text text-transparent">Soy Candles</span> &amp; Bespoke Resin Art
            </h1>

            <p className="text-sm sm:text-base md:text-lg text-amoura-subtext max-w-2xl mx-auto lg:mx-0 font-normal leading-relaxed">
              Infuse your sanctuary with pure aromatherapy, royal urli festive candles, and crystal-clear resin masterpieces. Hand-poured using 100% pure organic soy wax and natural botanicals.
            </p>

            {/* CTAs */}
            <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4 pt-2">
              <button
                onClick={() => {
                  if (typeof onExploreClick === 'function') {
                    onExploreClick();
                  } else {
                    const el = document.getElementById('candles');
                    if (el) el.scrollIntoView({ behavior: 'smooth' });
                  }
                }}
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-3.5 rounded-full font-semibold text-sm bg-gradient-to-r from-amoura-gold via-amoura-gold-light to-amoura-gold-dark text-amoura-dark shadow-gold-glow hover:shadow-gold-glow-lg transition-all duration-300 transform hover:-translate-y-0.5 active:translate-y-0 cursor-pointer"
              >
                <span>Explore Candle Collection</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <button
                onClick={() => openWhatsApp('Hi Amoura Crafts! I am exploring your handcrafted candles and resin art on your website. I would love to place an order! ✨')}
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-7 py-3.5 rounded-full font-semibold text-sm bg-amoura-card border border-amoura-line text-amoura-cream hover:text-amoura-gold hover:border-amoura-gold transition-all duration-200"
              >
                <MessageCircle className="w-4 h-4 text-green-500 fill-green-500/20" />
                <span>Order via WhatsApp</span>
              </button>
            </div>

            {/* Micro Highlights */}
            <div className="pt-6 grid grid-cols-3 gap-3 border-t border-amoura-line/60 max-w-lg mx-auto lg:mx-0">
              <div className="text-center lg:text-left">
                <span className="font-display block text-xl sm:text-2xl font-bold text-amoura-gold">100%</span>
                <span className="text-[11px] text-amoura-muted uppercase tracking-wider">Soy Wax</span>
              </div>
              <div className="text-center lg:text-left">
                <span className="font-display block text-xl sm:text-2xl font-bold text-amoura-gold">₹1,000</span>
                <span className="text-[11px] text-amoura-muted uppercase tracking-wider">Free Delivery</span>
              </div>
              <div className="text-center lg:text-left">
                <span className="font-display block text-xl sm:text-2xl font-bold text-amoura-gold">5.0 ★</span>
                <span className="text-[11px] text-amoura-muted uppercase tracking-wider">Verified Reviews</span>
              </div>
            </div>

          </div>

          {/* Right Column: Featured Visual Presentation */}
          <div className="lg:col-span-5 relative">
            <div className="relative mx-auto max-w-md sm:max-w-lg lg:max-w-none">
              
              {/* Outer Golden Glow Border Frame */}
              <div className="relative rounded-3xl p-1 bg-gradient-to-tr from-amoura-gold/40 via-amoura-line to-amoura-gold/30 shadow-2xl overflow-hidden group">
                <div className="relative rounded-[22px] overflow-hidden bg-amoura-card aspect-square">
                  <img
                    src="/images/thumbs/img_19.webp"
                    alt="Amoura Crafts Royal Urli Floral Candle"
                    className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-700"
                    onError={(e) => {
                      e.target.onerror = null;
                      e.target.src = '/image/Aurelia Bloom Royal Glden Floral Candle 320.jpg';
                    }}
                  />

                  {/* Dark gradient overlay for text readability */}
                  <div className="absolute inset-0 bg-gradient-to-t from-amoura-dark/90 via-transparent to-transparent"></div>

                  {/* Overlay Floating Badge */}
                  <div className="absolute bottom-4 left-4 right-4 p-4 rounded-xl bg-amoura-bg/90 backdrop-blur-md border border-amoura-line flex items-center justify-between shadow-lg">
                    <div>
                      <span className="text-xs uppercase tracking-widest text-amoura-gold font-bold block">Featured Centerpiece</span>
                      <h3 className="font-display text-base font-bold text-amoura-cream">Royal Urli Floral Diya</h3>
                      <p className="text-xs text-amoura-muted">Hand-poured with dried botanicals &amp; gold flakes</p>
                    </div>
                    <div className="text-right">
                      <span className="text-lg font-bold text-amoura-gold">₹550</span>
                      <span className="text-xs line-through text-amoura-muted block">₹699</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Decorative Corner Floating Pill */}
              <div className="absolute -top-4 -right-4 px-4 py-2 rounded-full bg-amoura-maroon-900/90 border border-amoura-line shadow-xl backdrop-blur-md hidden sm:flex items-center gap-2 text-xs font-semibold text-amoura-cream">
                <Sparkles className="w-4 h-4 text-amoura-gold animate-spin" style={{ animationDuration: '4s' }} />
                <span>Limited Festive Batches</span>
              </div>

            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
