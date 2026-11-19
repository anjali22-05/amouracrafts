import React from 'react';
import { MessageCircle } from 'lucide-react';
import { openWhatsApp } from '../utils/whatsapp';

export default function FloatingWhatsApp() {
  const handleClick = () => {
    openWhatsApp('Hi Amoura Crafts! I am visiting your website and I would love to inquire about your handcrafted candles & resin gifts! ✨');
  };

  return (
    <aside aria-label="WhatsApp Quick Order Support" className="fixed bottom-6 right-6 z-40">
      <button
        onClick={handleClick}
        className="group relative flex items-center justify-center w-14 h-14 rounded-full bg-gradient-to-tr from-emerald-600 to-green-500 text-white shadow-2xl hover:shadow-emerald-500/50 hover:scale-110 active:scale-95 transition-all duration-300 border-2 border-white/20"
        aria-label="Chat with Amoura Crafts on WhatsApp"
      >
        <span className="absolute inset-0 rounded-full bg-green-500 animate-ping opacity-25"></span>
        <MessageCircle className="w-7 h-7 fill-white/10" />

        {/* Hover Tooltip */}
        <span className="absolute right-16 px-3 py-1.5 rounded-xl bg-amoura-card border border-amoura-line text-amoura-cream text-xs font-semibold whitespace-nowrap opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity duration-200 shadow-xl">
          Order on WhatsApp 💬
        </span>
      </button>
    </aside>
  );
}
