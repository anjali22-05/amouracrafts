import React from 'react';
import { Star, CheckCircle, Quote } from 'lucide-react';
import { cleanDate } from '../utils/formatters';

export default function ReviewCard({ review }) {
  return (
    <div className="bg-amoura-card border border-amoura-line rounded-2xl p-5 sm:p-6 flex flex-col justify-between shadow-card hover:border-amoura-gold/50 transition-all">
      <div className="space-y-3">
        {/* Rating & Quote */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1 text-amoura-gold">
            {[...Array(review.rating || 5)].map((_, i) => (
              <Star key={i} className="w-4 h-4 fill-amoura-gold text-amoura-gold" />
            ))}
          </div>
          <Quote className="w-5 h-5 text-amoura-gold/30" />
        </div>

        {/* Comment Text */}
        <p className="text-xs sm:text-sm text-amoura-cream-dim leading-relaxed italic">
          "{review.comment}"
        </p>
      </div>

      {/* Reviewer Meta */}
      <div className="pt-4 mt-4 border-t border-amoura-line/60 flex items-center justify-between text-xs">
        <div>
          <div className="flex items-center gap-1.5 font-bold text-amoura-cream">
            <span>{review.name}</span>
            <span className="flex items-center gap-0.5 text-[10px] text-emerald-400 font-medium bg-emerald-950/60 px-1.5 py-0.2 rounded border border-emerald-500/30">
              <CheckCircle className="w-2.5 h-2.5" /> Verified
            </span>
          </div>
          <span className="text-[11px] text-amoura-muted">
            {review.productName || 'Handcrafted Soy Candle'}
          </span>
        </div>
        <span className="text-[11px] text-amoura-muted">{cleanDate(review.date)}</span>
      </div>
    </div>
  );
}
