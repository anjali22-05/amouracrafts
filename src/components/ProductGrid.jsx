import React, { useState, useMemo } from 'react';
import ProductCard from './ProductCard';
import { Search, SlidersHorizontal } from 'lucide-react';

export default function ProductGrid({ title, subtitle, products = [], showFilters = true, id = "products" }) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTag, setSelectedTag] = useState('ALL');
  const [sortBy, setSortBy] = useState('featured');

  // Extract unique categories or tags
  const tags = useMemo(() => {
    const set = new Set();
    products.forEach(p => {
      if (p.category) set.add(p.category.toUpperCase());
      if (p.tag) set.add(p.tag.toUpperCase());
    });
    return ['ALL', ...Array.from(set)];
  }, [products]);

  // Filter & Sort
  const filteredProducts = useMemo(() => {
    let list = [...products];

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      list = list.filter(p =>
        (p.name && p.name.toLowerCase().includes(q)) ||
        (p.desc && p.desc.toLowerCase().includes(q)) ||
        (p.category && p.category.toLowerCase().includes(q))
      );
    }

    if (selectedTag !== 'ALL') {
      list = list.filter(p =>
        (p.category && p.category.toUpperCase() === selectedTag) ||
        (p.tag && p.tag.toUpperCase() === selectedTag)
      );
    }

    if (sortBy === 'price-low') {
      list.sort((a, b) => (Number(a.price) || 0) - (Number(b.price) || 0));
    } else if (sortBy === 'price-high') {
      list.sort((a, b) => (Number(b.price) || 0) - (Number(a.price) || 0));
    }

    return list;
  }, [products, searchQuery, selectedTag, sortBy]);

  return (
    <section id={id} className="py-12 sm:py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8 sm:mb-10">
        <div>
          {subtitle && (
            <span className="text-xs uppercase tracking-widest text-amoura-gold font-bold block mb-1">
              {subtitle}
            </span>
          )}
          <h2 className="font-display text-2xl sm:text-3xl md:text-4xl font-bold text-amoura-cream">
            {title}
          </h2>
        </div>

        {/* Search & Sort Controls */}
        {showFilters && (
          <div className="flex flex-wrap items-center gap-3 w-full md:w-auto">
            {/* Search Input */}
            <div className="relative flex-1 sm:w-64">
              <Search className="w-4 h-4 text-amoura-muted absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
              <input
                type="text"
                placeholder="Search products..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-3 py-2 text-xs rounded-xl bg-amoura-card border border-amoura-line text-amoura-cream placeholder-amoura-muted focus:outline-none focus:border-amoura-gold transition-colors"
              />
            </div>

            {/* Sort Dropdown */}
            <div className="relative">
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                aria-label="Sort products by"
                className="appearance-none pl-3 pr-8 py-2 text-xs rounded-xl bg-amoura-card border border-amoura-line text-amoura-cream focus:outline-none focus:border-amoura-gold transition-colors cursor-pointer"
              >
                <option value="featured">Featured First</option>
                <option value="price-low">Price: Low to High</option>
                <option value="price-high">Price: High to Low</option>
              </select>
              <SlidersHorizontal className="w-3.5 h-3.5 text-amoura-gold absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
            </div>
          </div>
        )}
      </div>

      {/* Filter Category Pills */}
      {showFilters && tags.length > 2 && (
        <div className="flex items-center gap-2 overflow-x-auto pb-4 mb-6 scrollbar-none">
          {tags.map((tag) => (
            <button
              key={tag}
              onClick={() => setSelectedTag(tag)}
              className={`px-3.5 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-all duration-200 cursor-pointer ${
                selectedTag === tag
                  ? 'bg-amoura-gold text-amoura-dark shadow-gold-glow'
                  : 'bg-amoura-card border border-amoura-line text-amoura-subtext hover:border-amoura-gold/50 hover:text-amoura-cream'
              }`}
            >
              {tag}
            </button>
          ))}
        </div>
      )}

      {/* Products Grid */}
      {filteredProducts.length === 0 ? (
        <div className="text-center py-16 bg-amoura-card/40 border border-amoura-line/60 rounded-2xl">
          <p className="text-amoura-subtext text-sm">No products found matching your search.</p>
          <button
            onClick={() => { setSearchQuery(''); setSelectedTag('ALL'); }}
            className="mt-3 text-xs text-amoura-gold underline hover:text-amoura-gold-light"
          >
            Reset Filters
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {filteredProducts.map((p) => (
            <ProductCard key={p.id} product={p} />
          ))}
        </div>
      )}

    </section>
  );
}
