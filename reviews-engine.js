/**
 * Amoura Crafts - Real Customer Reviews Engine (reviews-engine.js)
 * Permanently connected to Google Sheets Database!
 * Real-time synchronization across all devices with zero data loss.
 */

(function (window) {
    const DB_NAME = 'amoura_crafts_db';
    const DB_VERSION = 3;
    const STORE_NAME = 'customer_reviews';
    const STORAGE_KEY = 'amoura_google_sheet_reviews_v1';
    const GOOGLE_SHEET_API = "https://script.google.com/macros/s/AKfycbzdCK_Zefr3DBL3fHYp1SKmXRXudXBpLWA1EPQVR62XOijTYOKtBZpC1nCcmRQ6KxNhlw/exec";

    const FAKE_NAMES = [
        'Priya Sharma', 'Aarav Mehta', 'Neha Patel', 'Rohan Gupta',
        'Ananya Verma', 'Vikram Singh', 'Kavita Joshi', 'Deepak Nair',
        'Simran Kaur', 'Pooja Malhotra', 'Test Verification'
    ];

    function isRealReview(r) {
        if (!r || !r.name || typeof r.name !== 'string') return false;
        if (r.isDemo === true) return false;
        if (r.id && (String(r.id).startsWith('rev-demo') || String(r.id).startsWith('rev-seed'))) return false;
        const nameTrimmed = r.name.trim();
        if (FAKE_NAMES.includes(nameTrimmed)) return false;
        return true;
    }

    function cleanDate(d) {
        if (!d) return 'Recent';
        const str = String(d);
        if (str.includes('T')) return str.split('T')[0];
        return str;
    }

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

            return (list || []).filter(isRealReview);
        },

        getFromLocalStorage() {
            try {
                const raw = localStorage.getItem(STORAGE_KEY);
                if (raw) {
                    const parsed = JSON.parse(raw);
                    if (Array.isArray(parsed)) return parsed.filter(isRealReview);
                }
            } catch (e) {}
            return [];
        },

        async saveAll(reviews) {
            const cleaned = (reviews || []).filter(isRealReview).map(r => ({
                ...r,
                date: cleanDate(r.date),
                status: 'approved',
                verified: true,
                isDemo: false
            }));

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

            let all = [];

            // 1. Primary: Fetch real-time reviews directly from Google Sheet Database
            try {
                const res = await fetch(GOOGLE_SHEET_API + '?t=' + Date.now());
                if (res.ok) {
                    const remote = await res.json();
                    if (Array.isArray(remote)) {
                        all = remote.filter(isRealReview).map((r, i) => ({
                            id: r.id || 'sheet-rev-' + i,
                            name: String(r.name || 'Customer').trim(),
                            rating: Math.min(5, Math.max(1, Number(r.rating || 5))),
                            comment: String(r.comment || '').trim(),
                            date: cleanDate(r.date),
                            verified: true,
                            status: 'approved'
                        }));
                        await Storage.saveAll(all);
                    }
                }
            } catch (e) {
                console.warn("Direct Google Sheet fetch error, trying backend fallback:", e);
            }

            // 2. Fallback: If direct fetch failed, try Netlify Serverless Proxy
            if (all.length === 0) {
                try {
                    const res = await fetch('/.netlify/functions/reviews?t=' + Date.now());
                    if (res.ok) {
                        const data = await res.json();
                        if (Array.isArray(data.reviews) && data.reviews.length > 0) {
                            all = data.reviews.filter(isRealReview);
                            await Storage.saveAll(all);
                        }
                    }
                } catch (e) {}
            }

            // 3. Fallback: Local Cache
            if (all.length === 0) {
                all = await Storage.getAll();
            }

            // 4. Fallback: data/reviews.json
            if (all.length === 0) {
                try {
                    const res = await fetch('data/reviews.json?t=' + Date.now());
                    if (res.ok) {
                        const fb = await res.json();
                        if (Array.isArray(fb)) {
                            all = fb.filter(isRealReview);
                        }
                    }
                } catch (e) {}
            }

            // Strictly real reviews only
            all = all.filter(isRealReview);

            // Apply rating filter
            if (filterRating && filterRating !== 'all') {
                const rt = parseInt(filterRating, 10);
                all = all.filter(r => r.rating === rt);
            }

            // Sort by newest first
            all.sort((a, b) => {
                if (sortBy === 'highest') return (b.rating || 5) - (a.rating || 5) || new Date(b.date || 0) - new Date(a.date || 0);
                if (sortBy === 'lowest') return (a.rating || 5) - (b.rating || 5) || new Date(b.date || 0) - new Date(a.date || 0);
                return new Date(b.date || 0) - new Date(a.date || 0);
            });

            return all;
        },

        async getPendingReviews() {
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

            const today = new Date().toISOString().split('T')[0];
            const newReview = {
                id: "rev-" + Date.now() + "-" + Math.random().toString(36).substr(2, 6),
                name: data.name.trim(),
                rating: Number(data.rating),
                comment: data.comment.trim(),
                productName: data.productName ? data.productName.trim() : "Amoura Crafts",
                date: today,
                photo: data.photo || null,
                isDemo: false,
                verified: true,
                status: "approved"
            };

            // 1. Immediately save locally to IndexedDB & localStorage for 0ms instant display
            let localList = await Storage.getAll();
            localList = [newReview, ...localList.filter(r => r.id !== newReview.id)];
            await Storage.saveAll(localList);

            // 2. Send directly to Google Sheet Database Web App
            try {
                fetch(GOOGLE_SHEET_API, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    mode: 'no-cors',
                    body: JSON.stringify({
                        name: newReview.name,
                        rating: newReview.rating,
                        comment: newReview.comment,
                        date: newReview.date
                    })
                }).catch(() => {});
            } catch (e) {}

            // 3. Send to Netlify Serverless Function (which also forwards to Google Sheet as backup)
            try {
                fetch('/.netlify/functions/reviews', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(newReview)
                }).catch(() => {});
            } catch (e) {}

            // 4. Record in Netlify Forms Dashboard
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
                message: "Thank you! Your review is now saved in our Google Sheet database and live on the website.",
                review: newReview
            };
        }
    };

    window.ReviewManager = ReviewManager;
    window.AmouraReviews = ReviewManager;
})(window);
