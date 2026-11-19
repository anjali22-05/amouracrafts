import React, { useState, useEffect } from 'react';
import ReviewCard from '../components/ReviewCard';
import ReviewModal from '../components/ReviewModal';
import { reviewService } from '../services/reviewService';
import { Star, Sparkles, Plus, ShieldCheck } from 'lucide-react';

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
        <span className="text-xs uppercase tracking-widest text-amoura-gold font-bold inline-flex items-center gap-1.5">
          <Sparkles className="w-3.5 h-3.5" /> 100% Genuine Customer Feedback
        </span>
        <h1 className="font-display text-3xl sm:text-4xl md:text-5xl font-bold text-amoura-cream">
          Customer Reviews &amp; Stories
        </h1>
        <p className="text-xs sm:text-sm text-amoura-subtext max-w-2xl mx-auto">
          Read genuine feedback from customers across India who have illuminated their homes with Amoura Crafts.
        </p>

        {/* Rating Summary Card */}
        <div className="max-w-md mx-auto p-5 rounded-2xl bg-amoura-card border border-amoura-line flex items-center justify-around shadow-xl">
          <div className="text-center">
            <span className="font-display text-4xl font-bold text-amoura-gold">5.0</span>
            <div className="flex items-center gap-1 text-amoura-gold justify-center mt-1">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className="w-4 h-4 fill-amoura-gold text-amoura-gold" />
              ))}
            </div>
            <span className="text-[11px] text-amoura-muted mt-1 block">Overall Star Rating</span>
          </div>

          <div className="h-12 w-px bg-amoura-line/60" />

          <div className="text-center">
            <span className="font-display text-2xl font-bold text-amoura-cream">100%</span>
            <span className="text-[11px] text-emerald-400 font-semibold block mt-1">Verified Purchases</span>
            <span className="text-[11px] text-amoura-muted block">Direct WhatsApp Orders</span>
          </div>
        </div>

        <div>
          <button
            onClick={() => setIsModalOpen(true)}
            className="inline-flex items-center gap-2 px-6 py-3 rounded-full text-xs font-semibold bg-gradient-to-r from-amoura-gold via-amoura-gold-light to-amoura-gold-dark text-amoura-dark hover:shadow-gold-glow transition-all"
          >
            <Plus className="w-4 h-4" />
            <span>Write a Review</span>
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
