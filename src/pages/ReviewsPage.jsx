import React, { useState, useEffect } from 'react';
import ReviewCard from '../components/ReviewCard';
import ReviewModal from '../components/ReviewModal';
import { reviewService } from '../services/reviewService';
import { Star, Sparkles, Plus } from 'lucide-react';

export default function ReviewsPage() {
  const [reviews, setReviews] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    async function loadReviews() {
      const data = await reviewService.getReviews((updated) => setReviews(updated));
      setReviews(data);
    }
    loadReviews();
  }, []);

  return (
    <div className="py-12 px-4 sm:px-6 lg:px-8 max-w-6xl mx-auto space-y-12">
      
      {/* Header Banner */}
      <div className="text-center space-y-4">
        <span className="text-xs uppercase tracking-widest text-amoura-sage-dark font-bold inline-flex items-center gap-1.5">
          <Sparkles className="w-3.5 h-3.5 text-amoura-terracotta" /> 100% Genuine Customer Feedback
        </span>
        <h1 className="font-serif text-3xl sm:text-4xl md:text-5xl font-semibold text-amoura-charcoal">
          Customer Reviews &amp; Stories
        </h1>
        <p className="text-xs sm:text-sm text-amoura-muted max-w-2xl mx-auto">
          Read genuine feedback from customers across India who have illuminated their homes with Amoura Crafts.
        </p>

        {/* Rating Summary Card */}
        <div className="max-w-md mx-auto p-5 rounded-2xl bg-white border border-amoura-border flex items-center justify-around shadow-soft">
          <div className="text-center">
            <span className="font-serif text-4xl font-bold text-amoura-forest">5.0</span>
            <div className="flex items-center gap-1 text-amoura-terracotta justify-center mt-1">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className="w-4 h-4 fill-amoura-terracotta text-amoura-terracotta" />
              ))}
            </div>
            <span className="text-[11px] text-amoura-muted mt-1 block">Overall Star Rating</span>
          </div>

          <div className="h-12 w-px bg-amoura-border" />

          <div className="text-center">
            <span className="font-serif text-2xl font-bold text-amoura-charcoal">100%</span>
            <span className="text-[11px] text-amoura-forest font-semibold block mt-1">Verified Purchases</span>
            <span className="text-[11px] text-amoura-muted block">Direct Artisan Delivery</span>
          </div>
        </div>

        <div>
          <button
            onClick={() => setIsModalOpen(true)}
            className="inline-flex items-center gap-2 px-6 py-3 rounded-full text-xs font-semibold bg-amoura-forest text-amoura-ivory hover:bg-amoura-charcoal transition-all shadow-sm cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>Write a Verified Review</span>
          </button>
        </div>
      </div>

      {/* Reviews Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {reviews.map((rev) => (
          <ReviewCard key={rev.id} review={rev} />
        ))}
      </div>

      {/* Review Submission Modal */}
      <ReviewModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onReviewAdded={(newRev) => setReviews(prev => [newRev, ...prev])}
      />

    </div>
  );
}
