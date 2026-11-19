import React from 'react';
import { Sparkles, Heart, Flame, ShieldCheck, Leaf, Award } from 'lucide-react';
import { openWhatsApp } from '../utils/whatsapp';

export default function About() {
  return (
    <div className="py-12 px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto space-y-16">
      
      {/* Hero Header */}
      <div className="text-center space-y-4">
        <span className="text-xs uppercase tracking-widest text-amoura-gold font-bold inline-flex items-center gap-1.5">
          <Sparkles className="w-3.5 h-3.5" /> Handcrafted Studio in India
        </span>
        <h1 className="font-display text-3xl sm:text-4xl md:text-5xl font-bold text-amoura-cream">
          The Art of Mindful Illumination
        </h1>
        <p className="text-sm sm:text-base text-amoura-subtext max-w-2xl mx-auto leading-relaxed">
          Amoura Crafts was born out of a profound passion for pure aromas, traditional craftsmanship, and artistic expression.
        </p>
      </div>

      {/* Main Story Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-10 items-center">
        <div className="relative rounded-2xl overflow-hidden border border-amoura-line shadow-2xl bg-amoura-card aspect-[4/3]">
          <img
            src="/images/thumbs/img_19.webp"
            alt="Amoura Crafts Artisan Pouring Soy Wax"
            className="w-full h-full object-cover"
            onError={(e) => {
              e.target.onerror = null;
              e.target.src = '/image/Aurelia Bloom Royal Glden Floral Candle 320.jpg';
            }}
          />
        </div>

        <div className="space-y-4 text-xs sm:text-sm text-amoura-subtext leading-relaxed">
          <h2 className="font-display text-2xl font-bold text-amoura-cream">
            Hand-Poured with Pure Organic Soy Wax
          </h2>
          <p>
            Unlike mass-produced paraffin candles derived from petroleum by-products, every single candle at Amoura Crafts is poured by hand using <strong>100% natural soy wax</strong>. Soy wax burns cleaner, cooler, and lasts up to 50% longer with virtually zero black soot.
          </p>
          <p>
            Each fragrance is meticulously balanced with botanical essential oils to create a subtle, soothing ambiance that relaxes the mind without overwhelming the senses.
          </p>
          <div className="pt-2 flex items-center gap-3 text-amoura-gold font-semibold">
            <Flame className="w-4 h-4" />
            <span>Clean Burn • Non-Toxic • Cruelty Free</span>
          </div>
        </div>
      </div>

      {/* Pillars of Amoura Crafts */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="p-6 rounded-2xl bg-amoura-card border border-amoura-line space-y-3">
          <div className="w-10 h-10 rounded-full bg-amoura-gold/10 border border-amoura-gold/30 flex items-center justify-center text-amoura-gold">
            <Leaf className="w-5 h-5 text-emerald-400" />
          </div>
          <h3 className="font-display text-lg font-bold text-amoura-cream">Sustainable &amp; Pure</h3>
          <p className="text-xs text-amoura-muted leading-relaxed">
            We use biodegradable soy wax, lead-free braided cotton wicks, and reusable glass &amp; metal containers that can be repurposed forever.
          </p>
        </div>

        <div className="p-6 rounded-2xl bg-amoura-card border border-amoura-line space-y-3">
          <div className="w-10 h-10 rounded-full bg-amoura-gold/10 border border-amoura-gold/30 flex items-center justify-center text-amoura-gold">
            <Award className="w-5 h-5 text-amoura-gold" />
          </div>
          <h3 className="font-display text-lg font-bold text-amoura-cream">Artisan Excellence</h3>
          <p className="text-xs text-amoura-muted leading-relaxed">
            Every floral petal, metallic leaf, and resin pour is placed by hand with obsessive attention to symmetry, finish, and detail.
          </p>
        </div>

        <div className="p-6 rounded-2xl bg-amoura-card border border-amoura-line space-y-3">
          <div className="w-10 h-10 rounded-full bg-amoura-gold/10 border border-amoura-gold/30 flex items-center justify-center text-amoura-gold">
            <Heart className="w-5 h-5 text-rose-400" />
          </div>
          <h3 className="font-display text-lg font-bold text-amoura-cream">Custom Gifting</h3>
          <p className="text-xs text-amoura-muted leading-relaxed">
            We love crafting personalized colors, names, and customized fragrances for wedding favors, housewarmings, and festive gifting.
          </p>
        </div>
      </div>

      {/* Founder Callout */}
      <div className="p-8 rounded-3xl bg-gradient-to-r from-amoura-maroon-950 via-amoura-card to-amoura-maroon-950 border border-amoura-line text-center space-y-4">
        <h3 className="font-display text-2xl font-bold text-amoura-cream">
          Ready to Light Up Your Sanctuary?
        </h3>
        <p className="text-xs sm:text-sm text-amoura-subtext max-w-lg mx-auto">
          Explore our complete collection or chat with our artisans directly on WhatsApp for custom orders.
        </p>
        <button
          onClick={() => openWhatsApp('Hi Amoura Crafts! I just read your story and would love to place a custom order! ✨')}
          className="inline-flex items-center gap-2 px-8 py-3.5 rounded-full text-xs sm:text-sm font-semibold bg-amoura-gold text-amoura-dark hover:bg-amoura-gold-light transition-all shadow-gold-glow"
        >
          <span>Connect with Us on WhatsApp</span>
        </button>
      </div>

    </div>
  );
}
