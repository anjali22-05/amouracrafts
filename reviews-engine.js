/**
 * Amoura Crafts - Reviews & Feedback Engine
 * Handles persistent reviews (IndexedDB + localStorage + Netlify Functions),
 * submission validation, spam protection, and admin moderation.
 */

(function (window) {
    const DB_NAME = 'amoura_crafts_db';
    const DB_VERSION = 1;
    const STORE_NAME = 'customer_reviews';
    const STORAGE_KEY = 'amoura_customer_reviews_v2';
    const ADMIN_PIN = 'amoura2026';

    function openIDB() {
        return new Promise((resolve) => {
            if (!window.indexedDB) return resolve(null);
            const req = indexedDB.open(DB_NAME, DB_VERSION);
            req.onupgradeneeded = (e) => {
                const db = e.target.result;
                if (!db.objectStoreNames.contains(STORE_NAME)) {
                    db.createObjectStore(STORE_NAME, { keyPath: 'id' });
                }
            };
            req.onsuccess = () => resolve(req.result);
            req.onerror = () => resolve(null);
        });
    }

    const Storage = {
        async getAll() {
            try {
                const db = await openIDB();
                if (db) {
                    return new Promise((resolve) => {
                        const tx = db.transaction(STORE_NAME, 'readonly');
                        const store = tx.objectStore(STORE_NAME);
                        const req = store.getAll();
                        req.onsuccess = () => {
                            if (req.result && req.result.length > 0) {
                                resolve(req.result);
                            } else {
                                resolve(Storage.getFromLocalStorage());
                            }
                        };
                        req.onerror = () => resolve(Storage.getFromLocalStorage());
                    });
                }
            } catch (e) {}
            return Storage.getFromLocalStorage();
        },

        getFromLocalStorage() {
            try {
                const raw = localStorage.getItem(STORAGE_KEY);
                if (raw) {
                    const parsed = JSON.parse(raw);
                    if (Array.isArray(parsed)) return parsed;
                }
            } catch (e) {}
            return [];
        },

        async saveAll(reviews) {
            try {
                localStorage.setItem(STORAGE_KEY, JSON.stringify(reviews));
            } catch (e) {}

            try {
                const db = await openIDB();
                if (db) {
                    const tx = db.transaction(STORE_NAME, 'readwrite');
                    const store = tx.objectStore(STORE_NAME);
                    store.clear();
                    reviews.forEach(r => store.put(r));
                }
            } catch (e) {}
        }
    };

    const ReviewManager = {
        ADMIN_PIN,

        async init() {
            // Nothing to seed fake; only genuine reviews
        },

        async getReviews(options = {}) {
            const {
                filterRating = 'all',
                sortBy = 'newest',
                includePending = false,
                includeDemo = false // Strictly false for genuine production reviews
            } = options;

            let all = await Storage.getAll();

            if (!includeDemo) {
                all = all.filter(r => !r.isDemo);
            }

            if (!includePending) {
                all = all.filter(r => r.status === 'approved');
            }

            if (filterRating !== 'all') {
                const rt = parseInt(filterRating, 10);
                all = all.filter(r => r.rating === rt);
            }

            all.sort((a, b) => {
                if (sortBy === 'highest') return b.rating - a.rating || new Date(b.date) - new Date(a.date);
                if (sortBy === 'lowest') return a.rating - b.rating || new Date(b.date) - new Date(a.date);
                return new Date(b.date) - new Date(a.date);
            });

            return all;
        },

        async submitReview(data) {
            if (data.website_trap || data.honeypot_trap) {
                throw new Error("Spam detected.");
            }
            if (!data.name || data.name.trim().length < 2) {
                throw new Error("Please enter your name (minimum 2 characters).");
            }
            if (!data.comment || data.comment.trim().length < 10) {
                throw new Error("Please write a feedback message of at least 10 characters.");
            }
            if (!data.rating || data.rating < 1 || data.rating > 5) {
                throw new Error("Please select a rating from 1 to 5 stars.");
            }

            const newReview = {
                id: "rev-" + Date.now() + "-" + Math.random().toString(36).substr(2, 6),
                name: data.name.trim(),
                rating: Number(data.rating),
                comment: data.comment.trim(),
                date: new Date().toISOString().split('T')[0],
                photo: data.photo || null,
                isDemo: false,
                status: "pending" // Requires moderation before public display
            };

            // Attempt serverless save if active
            try {
                fetch('/.netlify/functions/reviews', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(newReview)
                }).catch(() => {});
            } catch (e) {}

            const all = await Storage.getAll();
            all.unshift(newReview);
            await Storage.saveAll(all);

            return {
                success: true,
                message: "Thank you for your valuable feedback! We truly appreciate your support.",
                review: newReview
            };
        },

        async getPendingReviews() {
            const all = await Storage.getAll();
            return all.filter(r => r.status === 'pending');
        },

        async moderateReview(id, action) {
            const all = await Storage.getAll();
            const idx = all.findIndex(r => r.id === id);
            if (idx === -1) return false;

            if (action === 'approve') {
                all[idx].status = 'approved';
            } else if (action === 'reject') {
                all[idx].status = 'rejected';
            } else if (action === 'delete') {
                all.splice(idx, 1);
            }

            await Storage.saveAll(all);
            return true;
        }
    };

    window.AmouraReviews = ReviewManager;
    ReviewManager.init();

})(window);
