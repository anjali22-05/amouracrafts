import React from 'react';
import { X, Trash2, Plus, Minus, ShoppingBag, ArrowRight, Sparkles } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { formatINR } from '../utils/formatters';

export default function CartDrawer() {
  const {
    cart,
    isCartOpen,
    closeCart,
    updateQuantity,
    removeFromCart,
    subtotal,
    isFreeShipping,
    shippingFee,
    amountNeededForFreeShipping,
    finalTotal,
    openCheckout
  } = useCart();

  if (!isCartOpen) return null;

  const progressPercent = Math.min(100, Math.round((subtotal / 1000) * 100));

  return (
    <div className="fixed inset-0 z-50 overflow-hidden animate-fadeIn">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/70 backdrop-blur-sm transition-opacity"
        onClick={closeCart}
      />

      <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-md bg-amoura-card border-l border-amoura-line flex flex-col shadow-2xl">
          
          {/* Header */}
          <div className="p-4 sm:p-5 border-b border-amoura-line flex items-center justify-between bg-amoura-bg">
            <div className="flex items-center gap-2">
              <ShoppingBag className="w-5 h-5 text-amoura-gold" />
              <h2 className="font-display text-lg font-bold text-amoura-cream">Your Shopping Bag</h2>
              <span className="text-xs text-amoura-gold font-bold bg-amoura-gold/10 px-2 py-0.5 rounded-full border border-amoura-gold/20">
                {cart.length} {cart.length === 1 ? 'item' : 'items'}
              </span>
            </div>
            <button
              onClick={closeCart}
              className="p-1.5 rounded-lg text-amoura-muted hover:text-amoura-cream hover:bg-amoura-card transition-colors"
              aria-label="Close Shopping Bag"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Free Shipping Progress Indicator */}
          <div className="p-3.5 bg-amoura-dark/80 border-b border-amoura-line/60">
            <div className="flex items-center justify-between text-xs mb-1.5">
              <span className="text-amoura-subtext flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-amoura-gold" />
                {isFreeShipping ? (
                  <strong className="text-emerald-400">You unlocked FREE Shipping across India!</strong>
                ) : (
                  <span>
                    Add <strong className="text-amoura-gold">{formatINR(amountNeededForFreeShipping)}</strong> more for <strong>FREE Shipping</strong>
                  </span>
                )}
              </span>
              <span className="text-[11px] font-bold text-amoura-gold">{progressPercent}%</span>
            </div>
            <div className="w-full h-1.5 rounded-full bg-amoura-card overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-amoura-gold to-emerald-400 transition-all duration-300"
                style={{ width: `${progressPercent}%` }}
              />
            </div>
          </div>

          {/* Cart Item List */}
          <div className="flex-1 overflow-y-auto p-4 sm:p-5 space-y-4">
            {cart.length === 0 ? (
              <div className="text-center py-16 space-y-3">
                <div className="w-16 h-16 rounded-full bg-amoura-bg border border-amoura-line flex items-center justify-center mx-auto text-amoura-muted">
                  <ShoppingBag className="w-8 h-8" />
                </div>
                <h3 className="font-display text-base font-bold text-amoura-cream">Your bag is empty</h3>
                <p className="text-xs text-amoura-muted max-w-xs mx-auto">
                  Discover our handmade collection of soy candles, resin trays, and botanical gifts.
                </p>
                <button
                  onClick={closeCart}
                  className="mt-2 inline-flex items-center gap-2 px-6 py-2.5 rounded-full text-xs font-semibold bg-amoura-gold text-amoura-dark hover:bg-amoura-gold-light transition-colors"
                >
                  Start Exploring
                </button>
              </div>
            ) : (
              cart.map((item) => (
                <div
                  key={item.id}
                  className="p-3 bg-amoura-bg/80 border border-amoura-line/60 rounded-xl flex gap-3 items-center"
                >
                  {/* Thumbnail */}
                  <img
                    src={item.img.startsWith('http') || item.img.startsWith('data:') ? item.img : `/${item.img.replace(/^\//, '')}`}
                    alt={item.name}
                    className="w-16 h-16 rounded-lg object-cover border border-amoura-line flex-shrink-0"
                    onError={(e) => {
                      e.target.onerror = null;
                      e.target.src = '/image/Aurelia Bloom Royal Glden Floral Candle 320.jpg';
                    }}
                  />

                  {/* Details */}
                  <div className="flex-1 min-w-0">
                    <h4 className="text-xs font-bold text-amoura-cream truncate">{item.name}</h4>
                    <p className="text-[11px] text-amoura-gold font-semibold">{formatINR(item.price)}</p>
                    {item.preferredColor && item.preferredColor !== 'Default' && (
                      <span className="text-[10px] text-amoura-muted block truncate">
                        Color: {item.preferredColor}
                      </span>
                    )}

                    {/* Quantity Selector */}
                    <div className="flex items-center gap-2 mt-2">
                      <div className="flex items-center border border-amoura-line rounded-lg bg-amoura-card overflow-hidden">
                        <button
                          onClick={() => updateQuantity(item.id, item.qty - 1)}
                          className="p-1 hover:text-amoura-gold text-amoura-cream transition-colors"
                          aria-label="Decrease Quantity"
                        >
                          <Minus className="w-3 h-3" />
                        </button>
                        <span className="px-2 text-xs font-bold text-amoura-cream">{item.qty}</span>
                        <button
                          onClick={() => updateQuantity(item.id, item.qty + 1)}
                          className="p-1 hover:text-amoura-gold text-amoura-cream transition-colors"
                          aria-label="Increase Quantity"
                        >
                          <Plus className="w-3 h-3" />
                        </button>
                      </div>

                      <button
                        onClick={() => removeFromCart(item.id)}
                        className="p-1 text-amoura-muted hover:text-rose-400 transition-colors ml-auto"
                        title="Remove Item"
                        aria-label="Remove Item"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Footer Checkout Summary */}
          {cart.length > 0 && (
            <div className="p-4 sm:p-5 border-t border-amoura-line bg-amoura-bg space-y-3">
              <div className="space-y-1.5 text-xs">
                <div className="flex justify-between text-amoura-subtext">
                  <span>Subtotal:</span>
                  <span className="font-semibold text-amoura-cream">{formatINR(subtotal)}</span>
                </div>
                <div className="flex justify-between text-amoura-subtext">
                  <span>Shipping:</span>
                  <span className="font-semibold text-amoura-cream">
                    {isFreeShipping ? <span className="text-emerald-400">FREE</span> : formatINR(shippingFee)}
                  </span>
                </div>
                <div className="flex justify-between text-sm font-bold text-amoura-gold pt-2 border-t border-amoura-line/60">
                  <span>Total Amount:</span>
                  <span className="font-display text-lg">{formatINR(finalTotal)}</span>
                </div>
              </div>

              <button
                onClick={openCheckout}
                className="w-full py-3.5 px-4 rounded-xl font-semibold text-sm bg-gradient-to-r from-amoura-gold via-amoura-gold-light to-amoura-gold-dark text-amoura-dark hover:shadow-gold-glow flex items-center justify-center gap-2 transition-all duration-200 cursor-pointer"
              >
                <span>Proceed to Checkout</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          )}

        </div>
      </div>
    </div>
  );
}
