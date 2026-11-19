import React from 'react';
import { MessageCircle } from 'lucide-react';
import { openWhatsApp } from '../utils/whatsapp';

export default function FloatingWhatsApp() {
  const handleClick = () => {
    openWhatsApp('Hi Amoura Crafts! I am exploring your handcrafted creations and would love to inquire about custom orders! ✨');
  };

  return (
    <aside aria-label="WhatsApp Quick Order Support" className="fixed bottom-6 right-6 z-40">
      <button
        onClick={handleClick}
        className="group relative flex items-center justify-center w-14 h-14 rounded-full bg-amoura-forest text-amoura-ivory shadow-elevated hover:bg-amoura-charcoal hover:scale-108 active:scale-95 transition-all duration-300 border-2 border-white/20 cursor-pointer"
        aria-label="Chat with Amoura Crafts on WhatsApp"
      >
        <span className="absolute inset-0 rounded-full bg-amoura-sage animate-ping opacity-25" />
        <MessageCircle className="w-7 h-7 fill-amoura-ivory/10 text-amoura-ivory" />

        {/* Hover Tooltip */}
        <span className="absolute right-16 px-3.5 py-1.5 rounded-xl bg-white border border-amoura-border text-amoura-charcoal text-xs font-semibold whitespace-nowrap opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity duration-200 shadow-elevated">
          Chat on WhatsApp 💬
        </span>
      </button>
    </aside>
  );
}
