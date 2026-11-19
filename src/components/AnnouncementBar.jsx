import React from 'react';
import { Sparkles, Phone, Truck } from 'lucide-react';

export default function AnnouncementBar() {
  return (
    <aside aria-label="Store Announcement" className="bg-gradient-to-r from-amoura-maroon-950 via-[#3a101b] to-amoura-maroon-950 border-b border-amoura-line text-amoura-cream text-xs sm:text-sm py-2 px-4 transition-all">
      <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-2 text-center sm:text-left">
        <div className="flex items-center gap-2 justify-center">
          <Sparkles className="w-4 h-4 text-amoura-gold animate-pulse flex-shrink-0" />
          <span className="tracking-wide">
            <strong>Free Delivery</strong> across India on all orders above <span className="text-amoura-gold font-semibold">₹1,000</span>
          </span>
        </div>

        <div className="flex items-center gap-4 text-amoura-cream-dim text-xs justify-center">
          <span className="hidden md:flex items-center gap-1.5">
            <Truck className="w-3.5 h-3.5 text-amoura-gold" />
            Express Dispatch in 24-48 hrs
          </span>
          <a
            href="https://wa.me/918700689036"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1.5 hover:text-amoura-gold transition-colors font-medium text-amoura-gold-light"
          >
            <Phone className="w-3.5 h-3.5" />
            WhatsApp Orders: +91 87006 89036
          </a>
        </div>
      </div>
    </aside>
  );
}
