import React, { useState } from 'react';
import { ShoppingBag, ArrowRight, Check, Star, Palette, Zap } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { formatINR, calculateDiscount } from '../utils/formatters';

const COLOR_SWATCHES = [
  { name: "Default", label: "Default / Original", color: "#EFE8DC" },
  { name: "Ivory", label: "Warm Ivory", color: "#F8F5EF" },
  { name: "Sage", label: "Sage Green", color: "#89977C" },
  { name: "Terracotta", label: "Terracotta", color: "#C47D5A" },
  { name: "Rose", label: "Royal Rose", color: "#E8BEA9" },
  { name: "Charcoal", label: "Charcoal Ash", color: "#292B28" }
];

export default function ProductCard({ product }) {
  const { addToCart, proceedToPayment } = useCart();
  const [added, setAdded] = useState(false);
  const [selectedColor, setSelectedColor] = useState(COLOR_SWATCHES[0].label);

  const price = Number(product.price) || 0;
  const mrp = Number(product.mrp) || Math.round(price + 149);
  const discountText = calculateDiscount(price, mrp);

  const handleAddToCart = (e) => {
    e.stopPropagation();
    addToCart(product, 1, selectedColor);
    setAdded(true);
    setTimeout(() => setAdded(false), 1600);
  };

  const handleBuyNow = (e) => {
    e.stopPropagation();
    addToCart(product, 1, selectedColor);
    const orderId = 'ORD-' + Date.now().toString(36).toUpperCase() + '-' + Math.random().toString(36).substring(2, 5).toUpperCase();
    const invoiceNumber = 'AC-' + new Date().getFullYear() + '-' + Math.floor(1000 + Math.random() * 9000);
    const shipping = price >= 1000 ? 0 : 99;

    const quickOrder = {
      orderId,
      invoiceNumber,
      orderDate: new Date().toISOString(),
      customerName: '',
      customerPhone: '',
      customerEmail: '',
      address: '',
      city: '',
      state: '',
      pincode: '',
      preferredColor: selectedColor,
      notes: '',
      items: [{ ...product, qty: 1, preferredColor: selectedColor }],
      subtotal: price,
      shipping,
      finalTotal: price + shipping,
      paymentMethod: "Online / QR",
      paymentStatus: "Payment Confirmation Pending"
    };

    proceedToPayment(quickOrder);
  };

  return (
    <div className="group relative bg-white border border-amoura-border rounded-2xl overflow-hidden shadow-soft hover:shadow-elevated hover:border-amoura-sage transition-all duration-300 flex flex-col justify-between hover:-translate-y-1">
      
      {/* Top Image Container */}
      <div className="relative aspect-square w-full overflow-hidden bg-amoura-cream">
        <img
          src={product.img.startsWith('http') || product.img.startsWith('data:') ? product.img : `/${product.img.replace(/^\//, '')}`}
          alt={product.name}
          loading="lazy"
          className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-500"
          onError={(e) => {
            e.target.onerror = null;
            e.target.src = '/image/Aurelia Bloom Royal Glden Floral Candle 320.jpg';
          }}
        />

        {/* Floating Badges */}
        <div className="absolute top-3 left-3 flex flex-col gap-1.5 z-10">
          {product.tag && (
            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-amoura-forest text-amoura-ivory shadow-sm">
              {product.tag}
            </span>
          )}
          {discountText && (
            <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amoura-terracotta text-white shadow-sm">
              {discountText}
            </span>
          )}
        </div>

        {/* Stock / Artisan availability badge */}
        <span className="absolute bottom-3 left-3 px-2 py-0.5 rounded text-[10px] font-semibold bg-white/90 text-amoura-forest border border-amoura-border backdrop-blur-sm shadow-sm">
          In Stock • Hand-poured
        </span>
      </div>

      {/* Product Details Content */}
      <div className="p-4 sm:p-5 flex-1 flex flex-col justify-between space-y-4">
        
        <div>
          {/* Star Rating */}
          <div className="flex items-center gap-1 text-amoura-terracotta text-xs mb-1.5">
            {[...Array(5)].map((_, i) => (
              <Star key={i} className="w-3.5 h-3.5 fill-amoura-terracotta text-amoura-terracotta" />
            ))}
            <span className="text-[11px] text-amoura-muted ml-1 font-medium">5.0 (Verified)</span>
          </div>

          {/* Product Name */}
          <h3 className="font-serif text-lg font-bold text-amoura-charcoal group-hover:text-amoura-forest transition-colors line-clamp-1">
            {product.name}
          </h3>

          {/* Description */}
          <p className="text-xs text-amoura-muted mt-1 line-clamp-2 leading-relaxed">
            {product.desc || `Handcrafted organic soy creation infused with natural botanicals.`}
          </p>
        </div>

        {/* Color Customization Swatches */}
        <div className="pt-2 border-t border-amoura-border/60">
          <div className="flex items-center justify-between text-xs mb-2">
            <span className="text-[11px] text-amoura-muted flex items-center gap-1 font-medium">
              <Palette className="w-3 h-3 text-amoura-sage-dark" /> Shade:
            </span>
            <span className="text-[11px] font-semibold text-amoura-forest truncate max-w-[120px]">
              {selectedColor.split('/')[0]}
            </span>
          </div>

          {/* Color Dots */}
          <div className="flex items-center gap-2">
            {COLOR_SWATCHES.map((swatch) => (
              <button
                key={swatch.name}
                type="button"
                onClick={() => setSelectedColor(swatch.label)}
                title={swatch.label}
                aria-label={`Select color ${swatch.label}`}
                className={`w-5 h-5 rounded-full border transition-all ${
                  selectedColor === swatch.label
                    ? 'border-amoura-forest ring-2 ring-amoura-forest/30 scale-110'
                    : 'border-amoura-border hover:scale-105'
                }`}
                style={{ backgroundColor: swatch.color }}
              />
            ))}
          </div>

          {/* Pricing Row */}
          <div className="flex items-baseline gap-2 mt-3">
            <span className="font-serif text-2xl font-bold text-amoura-forest">
              {formatINR(price)}
            </span>
            {mrp > price && (
              <span className="text-xs text-amoura-muted line-through font-normal">
                {formatINR(mrp)}
              </span>
            )}
          </div>
        </div>

        {/* Dual Actions: Add to Cart & Buy Now */}
        <div className="grid grid-cols-2 gap-2 pt-1">
          <button
            onClick={handleAddToCart}
            className={`w-full py-2.5 px-2 rounded-xl text-xs font-semibold flex items-center justify-center gap-1.5 transition-all duration-200 cursor-pointer ${
              added
                ? 'bg-emerald-700 text-white'
                : 'bg-amoura-cream text-amoura-forest hover:bg-amoura-forest hover:text-amoura-ivory border border-amoura-border'
            }`}
          >
            {added ? (
              <>
                <Check className="w-3.5 h-3.5" />
                <span>Added</span>
              </>
            ) : (
              <>
                <ShoppingBag className="w-3.5 h-3.5" />
                <span>Add to Bag</span>
              </>
            )}
          </button>

          <button
            onClick={handleBuyNow}
            className="w-full py-2.5 px-2 rounded-xl text-xs font-semibold bg-amoura-forest text-amoura-ivory hover:bg-amoura-charcoal flex items-center justify-center gap-1.5 transition-colors shadow-sm cursor-pointer"
          >
            <Zap className="w-3.5 h-3.5 text-amoura-terracotta-light fill-amoura-terracotta-light" />
            <span>Buy Now</span>
          </button>
        </div>

      </div>

    </div>
  );
}
