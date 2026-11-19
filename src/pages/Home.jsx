import React, { useState, useEffect } from 'react';
import Hero from '../components/Hero';
import ProductGrid from '../components/ProductGrid';
import Gallery3D from '../components/Gallery3D';
import ReviewCard from '../components/ReviewCard';
import ReviewModal from '../components/ReviewModal';
import { CANDLE_PRODUCTS } from '../data/candles';
import { RESIN_PRODUCTS } from '../data/resin';
import { productService } from '../services/productService';
import { reviewService } from '../services/reviewService';
import { Sparkles, MessageCircle, Heart, Star, ShieldCheck, Mail, MapPin, Phone, Plus } from 'lucide-react';
import { openWhatsApp } from '../utils/whatsapp';

export default function Home() {
  const [candles, setCandles] = useState(CANDLE_PRODUCTS);
  const [resin, setResin] = useState(RESIN_PRODUCTS);
  const [reviews, setReviews] = useState([]);
  const [isReviewModalOpen, setIsReviewModalOpen] = useState(false);

  // Sync custom products from local storage & cloud
  useEffect(() => {
    async function loadProducts() {
      const custom = await productService.getProducts((updatedCustom) => {
        mergeCustom(updatedCustom);
      });
      mergeCustom(custom);
    }

    function mergeCustom(customList) {
      if (!Array.isArray(customList)) return;
      const customCandles = customList.filter(p => !p.category || p.category.toLowerCase().includes('candle') || p.category.toLowerCase() === 'candles');
      const customResin = customList.filter(p => p.category && (p.category.toLowerCase().includes('resin') || p.category.toLowerCase().includes('tray')));

      setCandles([...customCandles, ...CANDLE_PRODUCTS]);
      setResin([...customResin, ...RESIN_PRODUCTS]);
    }

    loadProducts();

    // Listen for custom product changes from admin portal
    const handleProductsChanged = (e) => {
      mergeCustom(e.detail);
    };
    window.addEventListener('amoura_products_changed', handleProductsChanged);
    return () => window.removeEventListener('amoura_products_changed', handleProductsChanged);
  }, []);

  // Load reviews
  useEffect(() => {
    async function fetchReviews() {
      const data = await reviewService.getReviews((updated) => setReviews(updated));
      setReviews(data);
    }
    fetchReviews();
  }, []);

  return (
    <div className="space-y-4">
      {/* Hero Section */}
      <Hero
        onExploreClick={() => {
          const el = document.getElementById('candles');
          if (el) el.scrollIntoView({ behavior: 'smooth' });
        }}
      />

      {/* Trust Highlights Section */}
      <section className="py-10 bg-amoura-dark/60 border-b border-amoura-line/60">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
            <div className="space-y-1">
              <span className="font-display text-2xl font-bold text-amoura-gold">100% Pure</span>
              <p className="text-xs text-amoura-subtext">Organic Soy Wax</p>
            </div>
            <div className="space-y-1">
              <span className="font-display text-2xl font-bold text-amoura-gold">₹1,000+</span>
              <p className="text-xs text-amoura-subtext">Free Shipping India</p>
            </div>
            <div className="space-y-1">
              <span className="font-display text-2xl font-bold text-amoura-gold">Custom Colors</span>
              <p className="text-xs text-amoura-subtext">Artisan Personalization</p>
            </div>
            <div className="space-y-1">
              <span className="font-display text-2xl font-bold text-amoura-gold">5.0 ★</span>
              <p className="text-xs text-amoura-subtext">Happy Customer Reviews</p>
            </div>
          </div>
        </div>
      </section>

      {/* Candles Collection */}
      <ProductGrid
        id="candles"
        title="Artisan Soy Candle Collection"
        subtitle="Pure Aromatherapy &amp; Festive Centerpieces"
        products={candles}
      />

      {/* Resin Art Collection */}
      <div className="bg-amoura-dark/40 border-y border-amoura-line/60 py-6">
        <ProductGrid
          id="resin-art"
          title="Bespoke Resin Art &amp; Keepsakes"
          subtitle="Crystal Clarity • Custom Handcrafted Gifting"
          products={resin}
        />
      </div>

      {/* 3D Showcase Gallery */}
      <Gallery3D />

      {/* Verified Reviews Section */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mb-10">
          <div>
            <span className="text-xs uppercase tracking-widest text-amoura-gold font-bold block mb-1">
              Real Experiences
            </span>
            <h2 className="font-display text-2xl sm:text-3xl md:text-4xl font-bold text-amoura-cream">
              Loved by Candle Enthusiasts
            </h2>
          </div>

          <button
            onClick={() => setIsReviewModalOpen(true)}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full text-xs font-semibold bg-amoura-card border border-amoura-line text-amoura-cream hover:text-amoura-gold hover:border-amoura-gold transition-colors"
          >
            <Plus className="w-3.5 h-3.5 text-amoura-gold" />
            <span>Write a Review</span>
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {reviews.slice(0, 6).map((rev) => (
            <ReviewCard key={rev.id} review={rev} />
          ))}
        </div>
      </section>

      {/* Contact & Custom Order Section */}
      <section id="contact" className="py-16 bg-amoura-card border-t border-amoura-line">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-center">
            
            <div className="space-y-4">
              <span className="text-xs uppercase tracking-widest text-amoura-gold font-bold block">
                Get In Touch
              </span>
              <h2 className="font-display text-2xl sm:text-3xl md:text-4xl font-bold text-amoura-cream">
                Looking for Custom Bulk Favors or Wedding Gifting?
              </h2>
              <p className="text-xs sm:text-sm text-amoura-subtext leading-relaxed">
                Whether you need personalized colors, bulk candles for corporate events, or customized resin wedding platters, our artisans are ready to craft your vision.
              </p>

              <div className="space-y-2.5 pt-2 text-xs text-amoura-cream">
                <div className="flex items-center gap-2.5">
                  <Phone className="w-4 h-4 text-amoura-gold" />
                  <span>+91 87006 89036 (WhatsApp &amp; Support)</span>
                </div>
                <div className="flex items-center gap-2.5">
                  <Mail className="w-4 h-4 text-amoura-gold" />
                  <span>craftsamoura@gmail.com</span>
                </div>
                <div className="flex items-center gap-2.5">
                  <MapPin className="w-4 h-4 text-amoura-gold" />
                  <span>Artisan Studio, India • Shipping Across All Pincodes</span>
                </div>
              </div>
            </div>

            <div className="p-6 sm:p-8 rounded-2xl bg-amoura-bg border border-amoura-line space-y-4 shadow-xl">
              <h3 className="font-display text-lg font-bold text-amoura-cream">
                Direct WhatsApp Studio Support
              </h3>
              <p className="text-xs text-amoura-muted">
                Have a question about a candle, fragrance blend, or customization? Send us a direct message on WhatsApp for instant assistance.
              </p>

              <button
                onClick={() => openWhatsApp('Hi Amoura Crafts! I would like to inquire about placing a custom or bulk order. ✨')}
                className="w-full py-3.5 px-4 rounded-xl font-semibold text-xs sm:text-sm bg-gradient-to-r from-amoura-gold via-amoura-gold-light to-amoura-gold-dark text-amoura-dark hover:shadow-gold-glow flex items-center justify-center gap-2 transition-all cursor-pointer"
              >
                <MessageCircle className="w-4 h-4 text-amoura-dark" />
                <span>Chat with Founder on WhatsApp</span>
              </button>
            </div>

          </div>
        </div>
      </section>

      {/* Review Modal */}
      <ReviewModal
        isOpen={isReviewModalOpen}
        onClose={() => setIsReviewModalOpen(false)}
        onReviewAdded={(newRev) => setReviews(prev => [newRev, ...prev])}
      />
    </div>
  );
}
