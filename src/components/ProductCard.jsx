import React, { useState } from 'react';
import { ShoppingBag, MessageCircle, Check, Star, Palette } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { formatINR, calculateDiscount } from '../utils/formatters';
import { openWhatsApp } from '../utils/whatsapp';

const COLOR_OPTIONS = [
  "Default / As Shown",
  "Golden Champagne",
  "Warm Ivory White",
  "Royal Rose Pink",
  "Lavender Purple",
  "Sage Green",
  "Deep Crimson Red"
];

export default function ProductCard({ product }) {
  const { addToCart } = useCart();
  const [added, setAdded] = useState(false);
  const [selectedColor, setSelectedColor] = useState(COLOR_OPTIONS[0]);
  const [showColorPicker, setShowColorPicker] = useState(false);

  const price = Number(product.price) || 0;
  const mrp = Number(product.mrp) || Math.round(price + 149);
  const discountText = calculateDiscount(price, mrp);

  const handleAddToCart = (e) => {
    e.stopPropagation();
    addToCart(product, 1, selectedColor);
    setAdded(true);
    setTimeout(() => setAdded(false), 1600);
  };

  const handleQuickWhatsApp = (e) => {
    e.stopPropagation();
    const msg = `Hi Amoura Crafts! I would like to order:
*${product.name}*
Price: ${formatINR(price)}
Preferred Color: ${selectedColor}
Product Image: https://amouracrafts.com/${product.img.replace(/^\//, '')}

Please confirm availability and dispatch! ✨`;
    openWhatsApp(msg);
  };

  return (
    <div className="group relative bg-amoura-card border border-amoura-line rounded-2xl overflow-hidden shadow-card hover:border-amoura-gold/60 transition-all duration-300 flex flex-col justify-between hover:-translate-y-1">
      
      {/* Top Media Area */}
      <div className="relative aspect-square w-full overflow-hidden bg-amoura-dark">
        <img
          src={product.img.startsWith('http') || product.img.startsWith('data:') ? product.img : `/${product.img.replace(/^\//, '')}`}
          alt={product.name}
          loading="lazy"
          className="w-full h-full object-cover transform group-hover:scale-108 transition-transform duration-500"
          onError={(e) => {
            e.target.onerror = null;
            e.target.src = '/image/Aurelia Bloom Royal Glden Floral Candle 320.jpg';
          }}
        />

        {/* Tag Badges */}
        <div className="absolute top-3 left-3 flex flex-col gap-1.5 z-10">
          {product.tag && (
            <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-amoura-maroon-900/90 text-amoura-gold border border-amoura-gold/40 shadow-sm backdrop-blur-md">
              {product.tag}
            </span>
          )}
          {discountText && (
            <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-rose-900/90 text-rose-200 border border-rose-500/30">
              {discountText}
            </span>
          )}
        </div>

        {/* Category Pill */}
        <span className="absolute bottom-3 left-3 px-2 py-0.5 rounded text-[10px] font-medium uppercase tracking-wider bg-amoura-dark/80 text-amoura-subtext border border-amoura-line/60 backdrop-blur-sm">
          {product.category || 'Candles'}
        </span>
      </div>

      {/* Product Content Details */}
      <div className="p-4 sm:p-5 flex-1 flex flex-col justify-between space-y-4">
        
        <div>
          {/* Star Rating */}
          <div className="flex items-center gap-1 text-amoura-gold text-xs mb-1.5">
            {[...Array(5)].map((_, i) => (
              <Star key={i} className="w-3.5 h-3.5 fill-amoura-gold text-amoura-gold" />
            ))}
            <span className="text-[11px] text-amoura-muted ml-1 font-medium">5.0 (Handcrafted)</span>
          </div>

          {/* Product Title */}
          <h3 className="font-display text-base sm:text-lg font-bold text-amoura-cream group-hover:text-amoura-gold-light transition-colors line-clamp-1">
            {product.name}
          </h3>

          {/* Product Description */}
          <p className="text-xs text-amoura-muted mt-1.5 line-clamp-2 leading-relaxed">
            {product.desc || `Hand-poured artisan ${product.name} crafted with 100% natural soy wax.`}
          </p>
        </div>

        {/* Color Choice Selector */}
        <div className="pt-2 border-t border-amoura-line/60">
          <div className="flex items-center justify-between text-xs mb-1.5">
            <span className="text-amoura-muted flex items-center gap-1">
              <Palette className="w-3 h-3 text-amoura-gold" /> Color Theme:
            </span>
            <button
              type="button"
              onClick={() => setShowColorPicker(!showColorPicker)}
              className="text-[11px] text-amoura-gold hover:underline font-medium"
            >
              {selectedColor.split('/')[0]}
            </button>
          </div>

          {showColorPicker && (
            <div className="p-2 mb-2 bg-amoura-dark border border-amoura-line rounded-lg space-y-1 animate-fadeIn">
              {COLOR_OPTIONS.map((c) => (
                <button
                  key={c}
                  type="button"
                  onClick={() => {
                    setSelectedColor(c);
                    setShowColorPicker(false);
                  }}
                  className={`w-full text-left px-2 py-1 rounded text-xs transition-colors flex items-center justify-between ${
                    selectedColor === c ? 'bg-amoura-gold/20 text-amoura-gold font-bold' : 'text-amoura-cream-dim hover:bg-amoura-card'
                  }`}
                >
                  <span>{c}</span>
                  {selectedColor === c && <Check className="w-3 h-3 text-amoura-gold" />}
                </button>
              ))}
            </div>
          )}

          {/* Pricing Row */}
          <div className="flex items-baseline gap-2 mt-2">
            <span className="font-display text-xl sm:text-2xl font-bold text-amoura-gold">
              {formatINR(price)}
            </span>
            {mrp > price && (
              <span className="text-xs sm:text-sm text-amoura-muted line-through font-normal">
                {formatINR(mrp)}
              </span>
            )}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="grid grid-cols-2 gap-2 pt-1">
          <button
            onClick={handleAddToCart}
            className={`w-full py-2.5 px-3 rounded-xl text-xs font-semibold flex items-center justify-center gap-1.5 transition-all duration-200 ${
              added
                ? 'bg-emerald-600 text-white'
                : 'bg-amoura-gold text-amoura-dark hover:bg-amoura-gold-light shadow-sm hover:shadow-gold-glow'
            }`}
          >
            {added ? (
              <>
                <Check className="w-3.5 h-3.5" />
                <span>Added!</span>
              </>
            ) : (
              <>
                <ShoppingBag className="w-3.5 h-3.5" />
                <span>Add to Cart</span>
              </>
            )}
          </button>

          <button
            onClick={handleQuickWhatsApp}
            className="w-full py-2.5 px-3 rounded-xl text-xs font-semibold bg-amoura-card border border-amoura-line text-amoura-cream hover:text-amoura-gold hover:border-amoura-gold flex items-center justify-center gap-1.5 transition-colors"
          >
            <MessageCircle className="w-3.5 h-3.5 text-green-500" />
            <span>Order WA</span>
          </button>
        </div>

      </div>

    </div>
  );
}
