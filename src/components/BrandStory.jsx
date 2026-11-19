import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Sparkles, Heart } from 'lucide-react';

export default function BrandStory() {
  return (
    <section className="py-16 sm:py-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
        
        {/* Left Visual Composition */}
        <div className="lg:col-span-6 relative">
          <div className="relative aspect-[4/3] rounded-3xl overflow-hidden bg-amoura-cream border border-amoura-border shadow-elevated">
            <img
              src="/images/thumbs/img_19.webp"
              alt="Artisan Studio Candle Pouring"
              className="w-full h-full object-cover"
              onError={(e) => {
                e.target.onerror = null;
                e.target.src = '/image/Aurelia Bloom Royal Glden Floral Candle 320.jpg';
              }}
            />
          </div>

          {/* Overlapping Callout Badge */}
          <div className="absolute -bottom-6 -right-4 sm:right-6 p-5 rounded-2xl bg-white border border-amoura-border shadow-elevated max-w-xs hidden sm:block">
            <span className="text-[10px] uppercase tracking-widest text-amoura-terracotta font-bold flex items-center gap-1 mb-1">
              <Sparkles className="w-3.5 h-3.5" /> Studio Philosophy
            </span>
            <p className="font-serif italic text-sm text-amoura-charcoal">
              "Every pour is a meditative celebration of natural light, fragrance, and sacred geometry."
            </p>
          </div>
        </div>

        {/* Right Editorial Text */}
        <div className="lg:col-span-6 space-y-6 text-center lg:text-left">
          <span className="text-xs uppercase tracking-widest text-amoura-sage-dark font-bold block">
            Our Studio Heritage
          </span>

          <h2 className="font-serif text-3xl sm:text-4xl md:text-5xl font-semibold text-amoura-charcoal leading-tight">
            Artisanship Born from Mindful Living
          </h2>

          <div className="space-y-4 text-xs sm:text-sm text-amoura-muted leading-relaxed">
            <p>
              At <strong>Amoura Crafts</strong>, we believe your sanctuary deserves creations that inspire peace and reverence. We hand-select premium organic soy wax, pure lead-free cotton wicks, and dried botanicals to craft pieces that honor both nature and heritage.
            </p>
            <p>
              Unlike mass-manufactured candles, each Amoura creation is poured in limited small batches. From our royal festive panchdeep urlis to crystal-clear resin trays, every element is refined by Indian artisans who love their craft.
            </p>
          </div>

          <div className="pt-2">
            <Link
              to="/about"
              className="inline-flex items-center gap-2 text-xs uppercase tracking-wider font-bold text-amoura-forest hover:text-amoura-charcoal border-b-2 border-amoura-forest pb-1 transition-all"
            >
              <span>Read Our Full Story</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>

      </div>
    </section>
  );
}
