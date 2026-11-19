import React, { useState, useEffect } from 'react';
import ProductGrid from '../components/ProductGrid';
import { PLANT_PRODUCTS } from '../data/plants';
import { productService } from '../services/productService';
import { Leaf, Sparkles } from 'lucide-react';

export default function Plants() {
  const [plants, setPlants] = useState(PLANT_PRODUCTS);

  useEffect(() => {
    async function loadProducts() {
      const custom = await productService.getProducts((updatedCustom) => {
        mergeCustom(updatedCustom);
      });
      mergeCustom(custom);
    }

    function mergeCustom(customList) {
      if (!Array.isArray(customList)) return;
      const customPlants = customList.filter(
        p => p.category && (
          p.category.toLowerCase().includes('plant') ||
          p.category.toLowerCase().includes('botanical') ||
          p.category.toLowerCase().includes('tree')
        )
      );
      setPlants([...customPlants, ...PLANT_PRODUCTS]);
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
          <Leaf className="w-3.5 h-3.5 text-amoura-sage-dark" /> Preserved Botanicals &amp; Nature Accents
        </div>
        <h1 className="font-serif text-3xl sm:text-4xl md:text-5xl font-semibold text-amoura-charcoal">
          Trees, Plants &amp; Floral Decor
        </h1>
        <p className="text-xs sm:text-sm text-amoura-muted max-w-2xl mx-auto mt-2 leading-relaxed">
          Discover hand-crafted preserved floral earrings, succulent mini planters, botanical resin coasters, and nature-inspired home accents.
        </p>
      </div>

      <ProductGrid
        title="Botanical &amp; Nature Accents"
        subtitle="Earthy &amp; Timeless Creations"
        products={plants}
      />
    </div>
  );
}
