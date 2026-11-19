import React from 'react';
import { Star, CheckCircle, Quote } from 'lucide-react';
import { cleanDate } from '../utils/formatters';

export default function ReviewCard({ review }) {
  return (
    <div className="bg-white border border-amoura-border rounded-2xl p-6 sm:p-7 flex flex-col justify-between shadow-soft hover:shadow-elevated transition-all duration-300">
      <div className="space-y-3.5">
        
        {/* Rating Stars & Quote */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1 text-amoura-terracotta">
            {[...Array(review.rating || 5)].map((_, i) => (
              <Star key={i} className="w-4 h-4 fill-amoura-terracotta text-amoura-terracotta" />
            ))}
          </div>
          <Quote className="w-5 h-5 text-amoura-sage/40" />
        </div>

        {/* Comment Text */}
        <p className="font-serif italic text-sm sm:text-base text-amoura-charcoal leading-relaxed">
          "{review.comment}"
        </p>
      </div>

      {/* Reviewer Meta */}
      <div className="pt-4 mt-6 border-t border-amoura-border/60 flex items-center justify-between text-xs">
        <div>
          <div className="flex items-center gap-1.5 font-bold text-amoura-charcoal">
            <span>{review.name}</span>
            <span className="flex items-center gap-0.5 text-[10px] text-amoura-forest font-semibold bg-amoura-cream px-1.5 py-0.5 rounded border border-amoura-border">
              <CheckCircle className="w-2.5 h-2.5 text-amoura-forest" /> Verified
            </span>
          </div>
          <span className="text-[11px] text-amoura-muted">
            {review.productName || 'Artisan Soy Creation'}
          </span>
        </div>
        <span className="text-[11px] text-amoura-muted">{cleanDate(review.date)}</span>
      </div>
    </div>
  );
}
