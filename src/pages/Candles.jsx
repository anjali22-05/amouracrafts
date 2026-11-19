import React, { useState, useEffect } from 'react';
import ProductGrid from '../components/ProductGrid';
import { CANDLE_PRODUCTS } from '../data/candles';
import { productService } from '../services/productService';
import { Flame, Sparkles } from 'lucide-react';

export default function Candles() {
  const [candles, setCandles] = useState(CANDLE_PRODUCTS);

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
      setCandles([...customCandles, ...CANDLE_PRODUCTS]);
    }

    loadProducts();

    const handleProductsChanged = (e) => {
      mergeCustom(e.detail);
    };
    window.addEventListener('amoura_products_changed', handleProductsChanged);
    return () => window.removeEventListener('amoura_products_changed', handleProductsChanged);
  }, []);

  return (
    <div className="py-8 space-y-6">
      {/* Category Hero Banner */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center py-12 sm:py-16 bg-amoura-cream/50 border-b border-amoura-border rounded-3xl">
        <div className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-white border border-amoura-border text-amoura-forest text-xs font-semibold uppercase tracking-wider mb-3 shadow-sm">
          <Flame className="w-3.5 h-3.5 text-amoura-terracotta" /> 100% Organic Soy Wax Collection
        </div>
        <h1 className="font-serif text-3xl sm:text-4xl md:text-5xl font-semibold text-amoura-charcoal">
          Artisan Handcrafted Candles
        </h1>
        <p className="text-xs sm:text-sm text-amoura-muted max-w-2xl mx-auto mt-2 leading-relaxed">
          From royal festive panchdeep urlis to subtle botanical aromatherapy jars, every piece is poured by hand with natural wicks and zero paraffin toxins.
        </p>
      </div>

      <ProductGrid
        title="Complete Candle Collection"
        subtitle="Browse All Fragrances &amp; Festive Designs"
        products={candles}
      />
    </div>
  );
}
