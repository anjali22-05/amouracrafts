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
      const customCandles = customList.filter(p => !p.category || p.category.toLowerCase().includes('candle') || p.category.toLowerCase() === 'candles');
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
      {/* Header Banner */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center py-8 bg-amoura-card/40 border-b border-amoura-line/60 rounded-2xl">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amoura-card border border-amoura-line text-amoura-gold text-xs font-semibold uppercase tracking-wider mb-3">
          <Flame className="w-3.5 h-3.5" /> 100% Organic Soy Wax
        </div>
        <h1 className="font-display text-3xl sm:text-4xl md:text-5xl font-bold text-amoura-cream">
          Artisan Hand-Poured Candles
        </h1>
        <p className="text-xs sm:text-sm text-amoura-subtext max-w-2xl mx-auto mt-2">
          Explore our complete collection of festive panchdeep diyas, aromatherapy jar candles, floral urli centerpieces, and decorative pillars.
        </p>
      </div>

      <ProductGrid
        title="Complete Candle Catalog"
        subtitle="Browse All Styles &amp; Fragrances"
        products={candles}
      />
    </div>
  );
}
