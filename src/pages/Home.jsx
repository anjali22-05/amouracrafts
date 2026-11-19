import React, { useState, useEffect } from 'react';
import Hero from '../components/Hero';
import CategoryCards from '../components/CategoryCards';
import ProductGrid from '../components/ProductGrid';
import BrandStory from '../components/BrandStory';
import WhyChooseUs from '../components/WhyChooseUs';
import Gallery3D from '../components/Gallery3D';
import BulkOrdersSection from '../components/BulkOrdersSection';
import ReviewCard from '../components/ReviewCard';
import ReviewModal from '../components/ReviewModal';
import { CANDLE_PRODUCTS } from '../data/candles';
import { RESIN_PRODUCTS } from '../data/resin';
import { productService } from '../services/productService';
import { reviewService } from '../services/reviewService';
import { Plus, Star, ShieldCheck, Heart } from 'lucide-react';

export default function Home() {
  const [candles, setCandles] = useState(CANDLE_PRODUCTS);
  const [resin, setResin] = useState(RESIN_PRODUCTS);
  const [reviews, setReviews] = useState([]);
  const [isReviewModalOpen, setIsReviewModalOpen] = useState(false);

  // Sync custom added products from local storage & cloud
  useEffect(() => {
    async function loadProducts() {
      const custom = await productService.getProducts((updatedCustom) => {
        mergeCustom(updatedCustom);
      });
      mergeCustom(custom);
    }

    function mergeCustom(customList) {
      if (!Array.isArray(customList)) return;
      const customCandles = customList.filter(
        p => !p.category || p.category.toLowerCase().includes('candle') || p.category.toLowerCase() === 'candles'
      );
      const customResin = customList.filter(
        p => p.category && (p.category.toLowerCase().includes('resin') || p.category.toLowerCase().includes('tray'))
      );

      setCandles([...customCandles, ...CANDLE_PRODUCTS]);
      setResin([...customResin, ...RESIN_PRODUCTS]);
    }

    loadProducts();

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

  // Combined best sellers for home preview
  const bestSellers = [...candles.slice(0, 8)];

  return (
    <div className="space-y-0">
      
      {/* 1. Editorial Hero Section */}
      <Hero
        onShopClick={() => {
          const el = document.getElementById('bestsellers');
          if (el) el.scrollIntoView({ behavior: 'smooth' });
        }}
        onExploreClick={() => {
          const el = document.getElementById('categories');
          if (el) el.scrollIntoView({ behavior: 'smooth' });
        }}
      />

      {/* 2. Featured 5 Categories */}
      <CategoryCards />

      {/* 3. Best Sellers Catalog */}
      <div id="bestsellers" className="bg-white/60 border-t border-amoura-border">
        <ProductGrid
          id="collection"
          title="Best Selling Creations"
          subtitle="Hand-Poured Artisan Favorites"
          products={bestSellers}
          showFilters={false}
        />
      </div>

      {/* 4. Brand Heritage & Philosophy Story */}
      <BrandStory />

      {/* 5. Why Choose Us (Genuine Business Highlights) */}
      <WhyChooseUs />

      {/* 6. Virtual 3D Showcase */}
      <Gallery3D />

      {/* 7. Bulk Orders & Custom Wedding Favors */}
      <BulkOrdersSection />

      {/* 8. Genuine Customer Reviews */}
      <section className="py-16 sm:py-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mb-12">
          <div>
            <span className="text-xs uppercase tracking-widest text-amoura-sage-dark font-bold block mb-1">
              Real Experiences
            </span>
            <h2 className="font-serif text-3xl sm:text-4xl md:text-5xl font-semibold text-amoura-charcoal">
              Loved by Candle Enthusiasts
            </h2>
          </div>

          <button
            onClick={() => setIsReviewModalOpen(true)}
            className="inline-flex items-center gap-2 px-6 py-3 rounded-full text-xs font-semibold bg-amoura-forest text-amoura-ivory hover:bg-amoura-charcoal transition-all shadow-sm cursor-pointer"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Write a Verified Review</span>
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {reviews.slice(0, 6).map((rev) => (
            <ReviewCard key={rev.id} review={rev} />
          ))}
        </div>
      </section>

      {/* Review Submission Modal */}
      <ReviewModal
        isOpen={isReviewModalOpen}
        onClose={() => setIsReviewModalOpen(false)}
        onReviewAdded={(newRev) => setReviews(prev => [newRev, ...prev])}
      />

    </div>
  );
}
