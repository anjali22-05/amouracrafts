/**
 * Amoura Crafts - Reviews Service
 * Connects to Google Sheets & Netlify reviews endpoint with LocalStorage caching
 */

const STORAGE_KEY = 'amoura_google_sheet_reviews_v1';
const NETLIFY_API = '/.netlify/functions/reviews';
const GOOGLE_SHEET_API = "https://script.google.com/macros/s/AKfycbzdCK_Zefr3DBL3fHYp1SKmXRXudXBpLWA1EPQVR62XOijTYOKtBZpC1nCcmRQ6KxNhlw/exec";

const DEFAULT_REVIEWS = [
  {
    id: "rev-1793467604837-u6ap0v",
    name: "Abhishek",
    rating: 5,
    comment: "Please buy scented candles quality is awasome",
    productName: "Amoura Crafts",
    date: "2026-10-31",
    verified: true,
    status: "approved",
    photo: null
  },
  {
    id: "rev-verified-102",
    name: "Ritika Sen",
    rating: 5,
    comment: "The lavender and vanilla soy candles fill the entire living room with a relaxing aroma. Truly luxury handmade finish!",
    productName: "Aurelia Bloom Royal Golden Candle",
    date: "2026-11-04",
    verified: true,
    status: "approved",
    photo: null
  },
  {
    id: "rev-verified-103",
    name: "Karan Johar Sharma",
    rating: 5,
    comment: "Ordered festive Panchdeep candles for gifting. Packaging was top-notch, arrived safe and on time. Highly recommended!",
    productName: "Shree Ganesha Royal Panchdeep",
    date: "2026-11-12",
    verified: true,
    status: "approved",
    photo: null
  }
];

export const reviewService = {
  getLocal() {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) {
        const parsed = JSON.parse(raw);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
    } catch (e) {}
    return DEFAULT_REVIEWS;
  },

  saveLocal(reviews) {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(reviews));
    } catch (e) {}
  },

  async getReviews(onCloudUpdate = null) {
    const local = this.getLocal();

    (async () => {
      let remote = null;

      try {
        const res = await fetch(NETLIFY_API + '?t=' + Date.now());
        if (res.ok) {
          const data = await res.json();
          if (Array.isArray(data) && data.length > 0) {
            remote = data;
          }
        }
      } catch (e) {}

      if (!remote) {
        try {
          const res = await fetch(GOOGLE_SHEET_API + '?type=reviews&t=' + Date.now());
          if (res.ok) {
            const data = await res.json();
            if (Array.isArray(data) && data.length > 0) {
              remote = data;
            }
          }
        } catch (e) {}
      }

      if (remote && Array.isArray(remote)) {
        const merged = [...remote];
        this.saveLocal(merged);
        if (typeof onCloudUpdate === 'function') {
          onCloudUpdate(merged);
        }
      }
    })();

    return local;
  },

  async submitReview(review) {
    const newRev = {
      id: 'rev-' + Date.now() + '-' + Math.random().toString(36).substr(2, 6),
      name: review.name.trim(),
      rating: Number(review.rating) || 5,
      comment: review.comment.trim(),
      productName: review.productName ? review.productName.trim() : "Amoura Crafts",
      date: new Date().toISOString().split('T')[0],
      verified: true,
      status: "approved",
      photo: review.photo || null
    };

    const current = this.getLocal();
    const updated = [newRev, ...current.filter(r => r.id !== newRev.id)];
    this.saveLocal(updated);

    try {
      fetch(NETLIFY_API, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newRev)
      }).catch(() => {});
    } catch (e) {}

    try {
      fetch(GOOGLE_SHEET_API, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: "addReview", ...newRev })
      }).catch(() => {});
    } catch (e) {}

    return newRev;
  }
};
