import React, { useState, useEffect } from 'react';
import ProductGrid from '../components/ProductGrid';
import { RESIN_PRODUCTS } from '../data/resin';
import { productService } from '../services/productService';
import { Sparkles, Palette } from 'lucide-react';

export default function ResinArt() {
  const [resin, setResin] = useState(RESIN_PRODUCTS);

  useEffect(() => {
    async function loadProducts() {
      const custom = await productService.getProducts((updatedCustom) => {
        mergeCustom(updatedCustom);
      });
      mergeCustom(custom);
    }

    function mergeCustom(customList) {
      if (!Array.isArray(customList)) return;
      const customResin = customList.filter(p => p.category && (p.category.toLowerCase().includes('resin') || p.category.toLowerCase().includes('tray')));
      setResin([...customResin, ...RESIN_PRODUCTS]);
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
          <Sparkles className="w-3.5 h-3.5" /> High-Gloss Crystal Clarity
        </div>
        <h1 className="font-display text-3xl sm:text-4xl md:text-5xl font-bold text-amoura-cream">
          Bespoke Resin Art &amp; Keepsakes
        </h1>
        <p className="text-xs sm:text-sm text-amoura-subtext max-w-2xl mx-auto mt-2">
          From auspicious Ganesha pooja trays to decorative coasters and floral keepsakes, each resin piece is poured by hand with crystal-clear resin and metallic pigments.
        </p>
      </div>

      <ProductGrid
        title="Resin Art Collection"
        subtitle="Artisan Trays, Plates &amp; Decor"
        products={resin}
      />
    </div>
  );
}
