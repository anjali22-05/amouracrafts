import React, { createContext, useContext, useState, useEffect } from 'react';

const CartContext = createContext();

const CART_STORAGE_KEY = 'amoura_cart_items_v2';
const FREE_SHIPPING_THRESHOLD = 1000;
const STANDARD_SHIPPING_FEE = 99;

export function CartProvider({ children }) {
  const [cart, setCart] = useState(() => {
    try {
      const saved = localStorage.getItem(CART_STORAGE_KEY);
      return saved ? JSON.parse(saved) : [];
    } catch (e) {
      return [];
    }
  });

  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [isPaymentOpen, setIsPaymentOpen] = useState(false);
  const [currentOrder, setCurrentOrder] = useState(null);
  const [completedOrder, setCompletedOrder] = useState(null);
  const [isInvoiceOpen, setIsInvoiceOpen] = useState(false);

  useEffect(() => {
    try {
      localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(cart));
    } catch (e) {}
  }, [cart]);

  const addToCart = (product, quantity = 1, preferredColor = "Default") => {
    setCart((prev) => {
      const existingIndex = prev.findIndex(item => item.id === product.id);
      if (existingIndex > -1) {
        const next = [...prev];
        next[existingIndex] = {
          ...next[existingIndex],
          qty: next[existingIndex].qty + quantity,
          preferredColor: preferredColor || next[existingIndex].preferredColor
        };
        return next;
      } else {
        return [
          ...prev,
          {
            id: product.id,
            name: product.name,
            price: Number(product.price) || 0,
            mrp: Number(product.mrp) || Math.round((Number(product.price) || 0) + 149),
            img: product.img || '/images/logo.png',
            category: product.category || 'candles',
            qty: quantity,
            preferredColor: preferredColor || "Default"
          }
        ];
      }
    });
    setIsCartOpen(true);
  };

  const removeFromCart = (id) => {
    setCart(prev => prev.filter(item => item.id !== id));
  };

  const updateQuantity = (id, newQty) => {
    if (newQty <= 0) {
      removeFromCart(id);
      return;
    }
    setCart(prev =>
      prev.map(item => (item.id === id ? { ...item, qty: newQty } : item))
    );
  };

  const clearCart = () => {
    setCart([]);
  };

  const totalCount = cart.reduce((sum, item) => sum + (item.qty || 1), 0);
  const subtotal = cart.reduce((sum, item) => sum + (item.price * (item.qty || 1)), 0);
  const isFreeShipping = subtotal >= FREE_SHIPPING_THRESHOLD;
  const shippingFee = (subtotal === 0 || isFreeShipping) ? 0 : STANDARD_SHIPPING_FEE;
  const amountNeededForFreeShipping = Math.max(0, FREE_SHIPPING_THRESHOLD - subtotal);
  const finalTotal = subtotal + shippingFee;

  const openCart = () => setIsCartOpen(true);
  const closeCart = () => setIsCartOpen(false);

  const startCheckout = () => {
    setIsCartOpen(false);
    setIsCheckoutOpen(true);
  };

  const closeCheckout = () => setIsCheckoutOpen(false);

  const proceedToPayment = (orderData) => {
    setCurrentOrder(orderData);
    setIsCheckoutOpen(false);
    setIsPaymentOpen(true);
  };

  const closePayment = () => setIsPaymentOpen(false);

  const completeOrder = (finalOrder) => {
    setCompletedOrder(finalOrder);
    setIsPaymentOpen(false);
    clearCart();
    setIsInvoiceOpen(true);
  };

  const closeInvoice = () => setIsInvoiceOpen(false);

  return (
    <CartContext.Provider
      value={{
        cart,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        totalCount,
        subtotal,
        isFreeShipping,
        shippingFee,
        amountNeededForFreeShipping,
        finalTotal,
        isCartOpen,
        openCart,
        closeCart,
        isCheckoutOpen,
        openCheckout: startCheckout,
        closeCheckout,
        isPaymentOpen,
        proceedToPayment,
        closePayment,
        currentOrder,
        completedOrder,
        isInvoiceOpen,
        completeOrder,
        closeInvoice
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
}
