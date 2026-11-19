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
        className="absolute inset-0 bg-amoura-charcoal/60 backdrop-blur-sm transition-opacity"
        onClick={closeCart}
      />

      <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-md bg-white border-l border-amoura-border flex flex-col shadow-2xl">
          
          {/* Header */}
          <div className="p-4 sm:p-5 border-b border-amoura-border flex items-center justify-between bg-amoura-ivory">
            <div className="flex items-center gap-2.5">
              <ShoppingBag className="w-5 h-5 text-amoura-forest" />
              <h2 className="font-serif text-xl font-bold text-amoura-charcoal">Your Shopping Bag</h2>
              <span className="text-xs text-amoura-forest font-bold bg-amoura-cream px-2.5 py-0.5 rounded-full border border-amoura-border">
                {cart.length} {cart.length === 1 ? 'item' : 'items'}
              </span>
            </div>
            <button
              onClick={closeCart}
              className="p-1.5 rounded-lg text-amoura-muted hover:text-amoura-charcoal hover:bg-amoura-cream transition-colors cursor-pointer"
              aria-label="Close Shopping Bag"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Free Shipping Progress Indicator */}
          <div className="p-4 bg-amoura-cream/50 border-b border-amoura-border">
            <div className="flex items-center justify-between text-xs mb-1.5">
              <span className="text-amoura-charcoal flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-amoura-terracotta" />
                {isFreeShipping ? (
                  <strong className="text-amoura-forest">You unlocked Complimentary Shipping!</strong>
                ) : (
                  <span>
                    Add <strong className="text-amoura-forest">{formatINR(amountNeededForFreeShipping)}</strong> more for <strong>Free Delivery</strong>
                  </span>
                )}
              </span>
              <span className="text-[11px] font-bold text-amoura-forest">{progressPercent}%</span>
            </div>
            <div className="w-full h-1.5 rounded-full bg-amoura-cream overflow-hidden">
              <div
                className="h-full bg-amoura-forest transition-all duration-300"
                style={{ width: `${progressPercent}%` }}
              />
            </div>
          </div>

          {/* Cart Item List */}
          <div className="flex-1 overflow-y-auto p-4 sm:p-5 space-y-4">
            {cart.length === 0 ? (
              <div className="text-center py-16 space-y-3">
                <div className="w-16 h-16 rounded-full bg-amoura-cream border border-amoura-border flex items-center justify-center mx-auto text-amoura-muted">
                  <ShoppingBag className="w-8 h-8" />
                </div>
                <h3 className="font-serif text-lg font-bold text-amoura-charcoal">Your bag is empty</h3>
                <p className="text-xs text-amoura-muted max-w-xs mx-auto">
                  Explore our handcrafted collection of organic soy candles, festive urlis, and resin art.
                </p>
                <button
                  onClick={closeCart}
                  className="mt-2 inline-flex items-center gap-2 px-6 py-2.5 rounded-full text-xs font-semibold bg-amoura-forest text-amoura-ivory hover:bg-amoura-charcoal transition-colors cursor-pointer"
                >
                  Start Exploring
                </button>
              </div>
            ) : (
              cart.map((item) => (
                <div
                  key={item.id}
                  className="p-3 bg-amoura-ivory border border-amoura-border rounded-xl flex gap-3.5 items-center shadow-soft"
                >
                  {/* Thumbnail */}
                  <img
                    src={item.img.startsWith('http') || item.img.startsWith('data:') ? item.img : `/${item.img.replace(/^\//, '')}`}
                    alt={item.name}
                    className="w-16 h-16 rounded-lg object-cover border border-amoura-border flex-shrink-0"
                    onError={(e) => {
                      e.target.onerror = null;
                      e.target.src = '/image/Aurelia Bloom Royal Glden Floral Candle 320.jpg';
                    }}
                  />

                  {/* Details */}
                  <div className="flex-1 min-w-0">
                    <h4 className="font-serif text-sm font-bold text-amoura-charcoal truncate">{item.name}</h4>
                    <p className="text-xs text-amoura-forest font-semibold">{formatINR(item.price)}</p>
                    {item.preferredColor && item.preferredColor !== 'Default' && (
                      <span className="text-[10px] text-amoura-muted block truncate">
                        Shade: {item.preferredColor}
                      </span>
                    )}

                    {/* Quantity Stepper */}
                    <div className="flex items-center gap-2 mt-2">
                      <div className="flex items-center border border-amoura-border rounded-lg bg-white overflow-hidden shadow-sm">
                        <button
                          onClick={() => updateQuantity(item.id, item.qty - 1)}
                          className="p-1 hover:text-amoura-forest text-amoura-charcoal transition-colors cursor-pointer"
                          aria-label="Decrease Quantity"
                        >
                          <Minus className="w-3 h-3" />
                        </button>
                        <span className="px-2.5 text-xs font-bold text-amoura-charcoal">{item.qty}</span>
                        <button
                          onClick={() => updateQuantity(item.id, item.qty + 1)}
                          className="p-1 hover:text-amoura-forest text-amoura-charcoal transition-colors cursor-pointer"
                          aria-label="Increase Quantity"
                        >
                          <Plus className="w-3 h-3" />
                        </button>
                      </div>

                      <button
                        onClick={() => removeFromCart(item.id)}
                        className="p-1 text-amoura-muted hover:text-rose-600 transition-colors ml-auto cursor-pointer"
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
            <div className="p-4 sm:p-5 border-t border-amoura-border bg-amoura-ivory space-y-3">
              <div className="space-y-1.5 text-xs">
                <div className="flex justify-between text-amoura-charcoal/80">
                  <span>Subtotal:</span>
                  <span className="font-semibold text-amoura-charcoal">{formatINR(subtotal)}</span>
                </div>
                <div className="flex justify-between text-amoura-charcoal/80">
                  <span>Delivery:</span>
                  <span className="font-semibold text-amoura-charcoal">
                    {isFreeShipping ? <span className="text-amoura-forest font-bold">Complimentary</span> : formatINR(shippingFee)}
                  </span>
                </div>
                <div className="flex justify-between text-sm font-bold text-amoura-charcoal pt-2 border-t border-amoura-border">
                  <span>Total Amount:</span>
                  <span className="font-serif text-lg text-amoura-forest">{formatINR(finalTotal)}</span>
                </div>
              </div>

              <button
                onClick={openCheckout}
                className="w-full py-3.5 px-4 rounded-xl font-semibold text-sm bg-amoura-forest text-amoura-ivory hover:bg-amoura-charcoal flex items-center justify-center gap-2 transition-all shadow-sm cursor-pointer"
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
