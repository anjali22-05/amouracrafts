import React from 'react';
import { Sparkles, Phone, Truck } from 'lucide-react';

export default function AnnouncementBar() {
  return (
    <aside
      aria-label="Store Announcement"
      className="bg-amoura-cream border-b border-amoura-border text-amoura-forest text-[10.5px] sm:text-xs py-1.5 sm:py-2 px-2.5 sm:px-6 transition-colors select-none w-full overflow-hidden"
    >
      <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-1 sm:gap-2 text-center sm:text-left">
        
        {/* Primary Delivery Offer */}
        <div className="flex items-center gap-1.5 justify-center">
          <Sparkles className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-amoura-terracotta flex-shrink-0" />
          <span className="tracking-wide text-amoura-forest font-medium">
            <strong className="font-semibold text-amoura-charcoal">Complimentary Delivery</strong> across India on orders above{' '}
            <span className="font-bold text-amoura-charcoal">₹1,000</span>
          </span>
        </div>

        {/* Dispatch & WhatsApp Contact */}
        <div className="flex items-center gap-2 sm:gap-3.5 text-amoura-forest/90 justify-center">
          <span className="inline-flex items-center gap-1 whitespace-nowrap text-amoura-forest/80 text-[10px] sm:text-xs">
            <Truck className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-amoura-sage-dark flex-shrink-0" />
            <span className="hidden xs:inline">Express Dispatch in 24–48 hrs</span>
            <span className="xs:hidden">24–48h Dispatch</span>
          </span>
          <span className="text-amoura-border-strong select-none">•</span>
          <a
            href="https://wa.me/918700689036"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1 hover:text-amoura-terracotta transition-colors font-semibold text-amoura-forest whitespace-nowrap text-[10px] sm:text-xs"
            title="WhatsApp Orders Hotline"
          >
            <Phone className="w-2.5 h-2.5 sm:w-3 sm:h-3 text-amoura-forest flex-shrink-0" />
            <span>Orders: +91 87006 89036</span>
          </a>
        </div>

      </div>
    </aside>
  );
}
