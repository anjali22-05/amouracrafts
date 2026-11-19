import React, { useState } from 'react';
import { X, Star, Sparkles, Send } from 'lucide-react';
import { reviewService } from '../services/reviewService';

export default function ReviewModal({ isOpen, onClose, onReviewAdded }) {
  const [rating, setRating] = useState(5);
  const [name, setName] = useState('');
  const [productName, setProductName] = useState('');
  const [comment, setComment] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!name.trim()) {
      setError('Please enter your name.');
      return;
    }
    if (!comment.trim()) {
      setError('Please enter your review feedback.');
      return;
    }

    setLoading(true);
    try {
      const newRev = await reviewService.submitReview({
        name: name.trim(),
        rating,
        productName: productName.trim() || 'Amoura Crafts Creation',
        comment: comment.trim()
      });

      if (typeof onReviewAdded === 'function') {
        onReviewAdded(newRev);
      }
      onClose();
    } catch (err) {
      setError('Failed to submit review. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fadeIn">
      <div className="relative w-full max-w-md bg-amoura-card border border-amoura-line rounded-2xl shadow-2xl overflow-hidden">
        
        {/* Header */}
        <div className="p-5 border-b border-amoura-line bg-amoura-bg flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-amoura-gold" />
            <h2 className="font-display text-lg font-bold text-amoura-cream">Share Your Experience</h2>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-amoura-muted hover:text-amoura-cream"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {error && (
          <div className="mx-5 mt-4 p-2.5 rounded-lg bg-rose-950/80 border border-rose-500/40 text-rose-200 text-xs">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="p-5 space-y-4">
          
          {/* Star Rating Selector */}
          <div>
            <label className="block text-xs font-semibold text-amoura-cream mb-2">Overall Rating</label>
            <div className="flex items-center gap-2">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  type="button"
                  onClick={() => setRating(star)}
                  className="p-1 text-amoura-gold hover:scale-125 transition-transform"
                >
                  <Star
                    className={`w-6 h-6 ${
                      star <= rating
                        ? 'fill-amoura-gold text-amoura-gold'
                        : 'text-amoura-muted/40'
                    }`}
                  />
                </button>
              ))}
              <span className="text-xs text-amoura-gold font-bold ml-2">{rating}.0 / 5.0</span>
            </div>
          </div>

          <div>
            <label className="block text-xs font-medium text-amoura-cream mb-1">Your Name *</label>
            <input
              type="text"
              required
              placeholder="e.g. Priya Sharma"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl bg-amoura-bg border border-amoura-line text-xs text-amoura-cream placeholder-amoura-muted focus:outline-none focus:border-amoura-gold"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-amoura-cream mb-1">Product Purchased</label>
            <input
              type="text"
              placeholder="e.g. Royal Urli Floral Candle"
              value={productName}
              onChange={(e) => setProductName(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl bg-amoura-bg border border-amoura-line text-xs text-amoura-cream placeholder-amoura-muted focus:outline-none focus:border-amoura-gold"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-amoura-cream mb-1">Your Review *</label>
            <textarea
              required
              rows={3}
              placeholder="How did you like the aroma, finish, and packaging?"
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              className="w-full px-3.5 py-2 rounded-xl bg-amoura-bg border border-amoura-line text-xs text-amoura-cream placeholder-amoura-muted focus:outline-none focus:border-amoura-gold"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 px-4 rounded-xl font-semibold text-xs bg-gradient-to-r from-amoura-gold via-amoura-gold-light to-amoura-gold-dark text-amoura-dark hover:shadow-gold-glow flex items-center justify-center gap-2 transition-all cursor-pointer disabled:opacity-75"
          >
            <Send className="w-3.5 h-3.5" />
            <span>{loading ? 'Submitting...' : 'Submit Verified Review'}</span>
          </button>

        </form>

      </div>
    </div>
  );
}
