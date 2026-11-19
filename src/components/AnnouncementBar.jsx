import React from 'react';
import { Sparkles, Phone, Truck } from 'lucide-react';

export default function AnnouncementBar() {
  return (
    <aside
      aria-label="Store Announcement"
      className="bg-amoura-cream border-b border-amoura-border text-amoura-forest text-xs py-2 px-4 transition-colors"
    >
      <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-2 text-center sm:text-left">
        <div className="flex items-center gap-2 justify-center">
          <Sparkles className="w-3.5 h-3.5 text-amoura-terracotta flex-shrink-0" />
          <span className="tracking-wide">
            <strong>Complimentary Delivery</strong> across India on orders above <span className="font-semibold text-amoura-charcoal">₹1,000</span>
          </span>
        </div>

        <div className="flex items-center gap-4 text-amoura-forest/80 text-xs justify-center">
          <span className="hidden md:flex items-center gap-1.5">
            <Truck className="w-3.5 h-3.5 text-amoura-sage-dark" />
            Express Dispatch in 24–48 hrs
          </span>
          <a
            href="https://wa.me/918700689036"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1.5 hover:text-amoura-terracotta transition-colors font-semibold text-amoura-forest"
          >
            <Phone className="w-3.5 h-3.5" />
            <span>Orders: +91 87006 89036</span>
          </a>
        </div>
      </div>
    </aside>
  );
}
