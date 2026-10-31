/**
 * Amoura Crafts - Reviews & Feedback Engine (reviews-engine.js)
 * Fully public, live instant-approval reviews system.
 * Saves to IndexedDB, localStorage, Netlify Serverless Cloud, and Netlify Forms.
 */

(function (window) {
    const DB_NAME = 'amoura_crafts_db';
    const DB_VERSION = 1;
    const STORE_NAME = 'customer_reviews';
    const STORAGE_KEY = 'amoura_customer_reviews_v3';

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
            let list = [];
            try {
                const db = await openIDB();
                if (db) {
                    list = await new Promise((resolve) => {
                        const tx = db.transaction(STORE_NAME, 'readonly');
                        const store = tx.objectStore(STORE_NAME);
                        const req = store.getAll();
                        req.onsuccess = () => resolve(req.result || []);
                        req.onerror = () => resolve([]);
                    });
                }
            } catch (e) {}

            if (!list || list.length === 0) {
                list = Storage.getFromLocalStorage();
            }

            // Also check old storage keys to recover any reviews previously submitted
            const oldKeys = ['amoura_customer_reviews_v2', 'amoura_customer_reviews', 'amoura_pending_reviews'];
            for (const k of oldKeys) {
                try {
                    const oldRaw = localStorage.getItem(k);
                    if (oldRaw) {
                        const parsed = JSON.parse(oldRaw);
                        if (Array.isArray(parsed)) {
                            parsed.forEach(p => {
                                if (!list.find(item => item.id === p.id || (item.name === p.name && item.comment === p.comment))) {
                                    list.push(p);
                                }
                            });
                        }
                    }
                } catch(e) {}
            }

            // Auto-approve all reviews so none are ever hidden
            list = list.map(r => ({ ...r, status: 'approved', verified: true, isDemo: false }));
            return list;
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
            // Ensure all are approved
            const cleaned = reviews.map(r => ({ ...r, status: 'approved', verified: true, isDemo: false }));
            try {
                localStorage.setItem(STORAGE_KEY, JSON.stringify(cleaned));
            } catch (e) {}

            try {
                const db = await openIDB();
                if (db) {
                    const tx = db.transaction(STORE_NAME, 'readwrite');
                    const store = tx.objectStore(STORE_NAME);
                    store.clear();
                    cleaned.forEach(r => store.put(r));
                }
            } catch (e) {}
        }
    };

    const ReviewManager = {
        ADMIN_PIN: "1234",

        async getReviews(options = {}) {
            const {
                filterRating = 'all',
                sortBy = 'newest'
            } = options;

            // 1. Get all local reviews
            let all = await Storage.getAll();

            // 2. Fetch public serverless reviews from Netlify Function
            try {
                const res = await fetch('/.netlify/functions/reviews', { method: 'GET' });
                if (res.ok) {
                    const remote = await res.json();
                    if (Array.isArray(remote.reviews)) {
                        remote.reviews.forEach(r => {
                            if (!all.find(item => item.id === r.id || (item.name === r.name && item.comment === r.comment))) {
                                all.push(r);
                            }
                        });
                        await Storage.saveAll(all);
                    }
                }
            } catch (e) {}

            // 3. Always merge with data/reviews.json so rich reviews are always present
            try {
                const res = await fetch('data/reviews.json');
                if (res.ok) {
                    const fallback = await res.json();
                    if (Array.isArray(fallback)) {
                        fallback.forEach(f => {
                            if (!all.find(item => item.id === f.id || (item.name === f.name && item.comment === f.comment))) {
                                all.push(f);
                            }
                        });
                    }
                }
            } catch (e) {}

            // Ensure all reviews are approved and publicly visible
            all = all.map(r => ({ ...r, status: 'approved', verified: true, isDemo: false }));

            // Apply rating filter if requested
            if (filterRating && filterRating !== 'all') {
                const rt = parseInt(filterRating, 10);
                all = all.filter(r => r.rating === rt);
            }

            // Apply sorting
            all.sort((a, b) => {
                if (sortBy === 'highest') return (b.rating || 5) - (a.rating || 5) || new Date(b.date || 0) - new Date(a.date || 0);
                if (sortBy === 'lowest') return (a.rating || 5) - (b.rating || 5) || new Date(b.date || 0) - new Date(a.date || 0);
                return new Date(b.date || 0) - new Date(a.date || 0);
            });

            return all;
        },

        async getPendingReviews() {
            // All reviews are approved immediately
            return [];
        },

        async moderateReview(id, action) {
            return { success: true };
        },

        async submitReview(data) {
            if (data.website_trap || data.honeypot_trap || data.honeypot) {
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
                productName: data.productName ? data.productName.trim() : "Amoura Crafts",
                date: new Date().toISOString().split('T')[0],
                photo: data.photo || null,
                isDemo: false,
                verified: true, // Marked verified
                status: "approved" // 100% LIVE and visible to all public immediately!
            };

            // 1. Save locally to IndexedDB & localStorage
            const all = await Storage.getAll();
            all.unshift(newReview);
            await Storage.saveAll(all);

            // 2. Send to Netlify Serverless API
            try {
                fetch('/.netlify/functions/reviews', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(newReview)
                }).catch(() => {});
            } catch (e) {}

            // 3. Send to Netlify Forms for persistent dashboard storage
            try {
                const formData = new URLSearchParams();
                formData.append('form-name', 'customer-reviews');
                formData.append('name', newReview.name);
                formData.append('rating', newReview.rating);
                formData.append('comment', newReview.comment);
                formData.append('date', newReview.date);
                fetch('/', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
                    body: formData.toString()
                }).catch(() => {});
            } catch (e) {}

            return {
                success: true,
                message: "Thank you for your review! It is now live on our website.",
                review: newReview
            };
        }
    };

    window.ReviewManager = ReviewManager;
    window.AmouraReviews = ReviewManager;
})(window);
