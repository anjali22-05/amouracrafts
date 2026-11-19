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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-amoura-charcoal/70 backdrop-blur-sm animate-fadeIn">
      <div className="relative w-full max-w-md bg-white border border-amoura-border rounded-2xl shadow-elevated overflow-hidden">
        
        {/* Header */}
        <div className="p-5 border-b border-amoura-border bg-amoura-cream flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-amoura-terracotta" />
            <h2 className="font-serif text-xl font-bold text-amoura-charcoal">Share Your Experience</h2>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-amoura-muted hover:text-amoura-charcoal cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {error && (
          <div className="mx-5 mt-4 p-2.5 rounded-lg bg-rose-50 border border-rose-200 text-rose-700 text-xs font-medium">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="p-5 sm:p-6 space-y-4">
          
          {/* Star Rating Picker */}
          <div>
            <label className="block text-xs font-semibold text-amoura-charcoal mb-2">Overall Rating</label>
            <div className="flex items-center gap-2">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  type="button"
                  onClick={() => setRating(star)}
                  className="p-1 text-amoura-terracotta hover:scale-120 transition-transform cursor-pointer"
                >
                  <Star
                    className={`w-6 h-6 ${
                      star <= rating
                        ? 'fill-amoura-terracotta text-amoura-terracotta'
                        : 'text-amoura-muted/30'
                    }`}
                  />
                </button>
              ))}
              <span className="text-xs text-amoura-forest font-bold ml-2">{rating}.0 / 5.0</span>
            </div>
          </div>

          <div>
            <label className="block text-xs font-medium text-amoura-charcoal mb-1">Your Name *</label>
            <input
              type="text"
              required
              placeholder="e.g. Priya Sharma"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl bg-amoura-ivory border border-amoura-border text-xs text-amoura-charcoal placeholder-amoura-muted focus:outline-none focus:border-amoura-forest"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-amoura-charcoal mb-1">Product Purchased</label>
            <input
              type="text"
              placeholder="e.g. Royal Urli Floral Diya"
              value={productName}
              onChange={(e) => setProductName(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl bg-amoura-ivory border border-amoura-border text-xs text-amoura-charcoal placeholder-amoura-muted focus:outline-none focus:border-amoura-forest"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-amoura-charcoal mb-1">Your Review *</label>
            <textarea
              required
              rows={3}
              placeholder="How did you like the aroma, finish, and packaging?"
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              className="w-full px-3.5 py-2 rounded-xl bg-amoura-ivory border border-amoura-border text-xs text-amoura-charcoal placeholder-amoura-muted focus:outline-none focus:border-amoura-forest"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 px-4 rounded-xl font-semibold text-xs bg-amoura-forest text-amoura-ivory hover:bg-amoura-charcoal flex items-center justify-center gap-2 transition-all shadow-sm cursor-pointer disabled:opacity-75"
          >
            <Send className="w-3.5 h-3.5" />
            <span>{loading ? 'Submitting...' : 'Submit Verified Review'}</span>
          </button>

        </form>

      </div>
    </div>
  );
}
