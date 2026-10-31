/**
 * Amoura Crafts - Reviews & Feedback Engine
 * Handles persistent reviews (IndexedDB + localStorage + Netlify Functions),
 * ratings breakdown, filtering, sorting, photo uploads, spam protection & admin moderation.
 */

(function (window) {
    const DB_NAME = 'amoura_crafts_db';
    const DB_VERSION = 1;
    const STORE_NAME = 'customer_reviews';
    const STORAGE_KEY = 'amoura_customer_reviews_v1';
    const DEMO_MODE_KEY = 'amoura_reviews_demo_mode';
    const ADMIN_PIN = 'amoura2026';

    // Default sample reviews (from data/reviews.json)
    const DEFAULT_SAMPLE_REVIEWS = [
        {
            id: "rev-demo-1",
            name: "Priya Sharma",
            email: "priya.s***@gmail.com",
            productName: "Aurelia Bloom Royal Golden Floral Candle",
            rating: 5,
            qualityRating: 5,
            websiteRating: 5,
            deliveryRating: 5,
            comment: "Absolutely loved the candle! The finishing is beautiful and it looks even better in real life.",
            date: "2026-10-24",
            verified: false,
            isDemo: true,
            status: "approved",
            photo: "images/thumbs/img_25.webp"
        },
        {
            id: "rev-demo-2",
            name: "Aarav Mehta",
            email: "aarav.m***@outlook.com",
            productName: "Mayura Royal Twin Peacock Floral Panchdeep Candle",
            rating: 5,
            qualityRating: 5,
            websiteRating: 5,
            deliveryRating: 4,
            comment: "The product quality is amazing. You can clearly see the effort and creativity behind the handmade work.",
            date: "2026-10-22",
            verified: false,
            isDemo: true,
            status: "approved",
            photo: "images/thumbs/img_27.webp"
        },
        {
            id: "rev-demo-3",
            name: "Neha Patel",
            email: "neha.p***@gmail.com",
            productName: "Velvet Heart Luxe Candle",
            rating: 5,
            qualityRating: 5,
            websiteRating: 5,
            deliveryRating: 5,
            comment: "Beautiful packaging and a premium feel. Definitely worth the price!",
            date: "2026-10-19",
            verified: false,
            isDemo: true,
            status: "approved",
            photo: "images/thumbs/img_31.webp"
        },
        {
            id: "rev-demo-4",
            name: "Rohan Gupta",
            email: "rohan.g***@gmail.com",
            productName: "Gulnaar Bloom Royal Floral Urli Candle",
            rating: 5,
            qualityRating: 5,
            websiteRating: 4,
            deliveryRating: 5,
            comment: "I ordered a floral candle and it looks stunning. Perfect for gifting and home decoration.",
            date: "2026-10-18",
            verified: false,
            isDemo: true,
            status: "approved",
            photo: "images/thumbs/img_26.webp"
        },
        {
            id: "rev-demo-5",
            name: "Ananya Verma",
            email: "ananya.v***@yahoo.com",
            productName: "Crystal Botanical Bear Gel Candle",
            rating: 5,
            qualityRating: 5,
            websiteRating: 5,
            deliveryRating: 5,
            comment: "The website is easy to use, the product details are clear, and the overall shopping experience was great.",
            date: "2026-10-15",
            verified: false,
            isDemo: true,
            status: "approved",
            photo: "images/thumbs/img_23.webp"
        },
        {
            id: "rev-demo-6",
            name: "Vikram Singh",
            email: "vikram.s***@gmail.com",
            productName: "Shree Ganesha Royal Panchdeep Floral Candle",
            rating: 5,
            qualityRating: 5,
            websiteRating: 5,
            deliveryRating: 5,
            comment: "Such beautiful handcrafted products! The detailing and finishing are impressive.",
            date: "2026-10-12",
            verified: false,
            isDemo: true,
            status: "approved",
            photo: "images/thumbs/img_29.webp"
        },
        {
            id: "rev-demo-7",
            name: "Kavita Joshi",
            email: "kavita.j***@gmail.com",
            productName: "Crimson & Cream Peony Candle",
            rating: 5,
            qualityRating: 5,
            websiteRating: 4,
            deliveryRating: 5,
            comment: "I really loved the design and fragrance of the candle. Would definitely love to explore more products.",
            date: "2026-10-09",
            verified: false,
            isDemo: true,
            status: "approved",
            photo: "images/thumbs/img_2.webp"
        },
        {
            id: "rev-demo-8",
            name: "Deepak Nair",
            email: "deepak.n***@gmail.com",
            productName: "Teal Geode Resin Wall Clock",
            rating: 5,
            qualityRating: 5,
            websiteRating: 5,
            deliveryRating: 4,
            comment: "A wonderful collection of handmade candles and resin art. Everything looks elegant and unique.",
            date: "2026-10-06",
            verified: false,
            isDemo: true,
            status: "approved",
            photo: "images/thumbs/resin_4.webp"
        },
        {
            id: "rev-demo-9",
            name: "Simran Kaur",
            email: "simran.k***@gmail.com",
            productName: "Sunshine Bloom Candle",
            rating: 4,
            qualityRating: 5,
            websiteRating: 4,
            deliveryRating: 4,
            comment: "The product was beautifully presented and made a lovely gift. Very happy with my experience.",
            date: "2026-10-04",
            verified: false,
            isDemo: true,
            status: "approved",
            photo: "images/thumbs/img_30.webp"
        },
        {
            id: "rev-demo-10",
            name: "Pooja Malhotra",
            email: "pooja.m***@gmail.com",
            productName: "Ocean Whisper Shell Candle",
            rating: 5,
            qualityRating: 5,
            websiteRating: 5,
            deliveryRating: 5,
            comment: "Amoura Crafts has a lovely collection. The designs are creative, elegant and perfect for special occasions.",
            date: "2026-10-01",
            verified: false,
            isDemo: true,
            status: "approved",
            photo: "images/thumbs/img_28.webp"
        }
    ];

    // IndexedDB open helper
    function openIDB() {
        return new Promise((resolve, reject) => {
            if (!window.indexedDB) {
                return resolve(null);
            }
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

    // Storage persistence adapter
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
            } catch (e) {
                // fallback
            }
            return Storage.getFromLocalStorage();
        },

        getFromLocalStorage() {
            try {
                const raw = localStorage.getItem(STORAGE_KEY);
                if (raw) {
                    const parsed = JSON.parse(raw);
                    if (Array.isArray(parsed) && parsed.length > 0) {
                        return parsed;
                    }
                }
            } catch (e) {}
            return [...DEFAULT_SAMPLE_REVIEWS];
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
        },

        isDemoMode() {
            const val = localStorage.getItem(DEMO_MODE_KEY);
            return val === null ? true : val === 'true';
        },

        setDemoMode(enabled) {
            localStorage.setItem(DEMO_MODE_KEY, enabled ? 'true' : 'false');
        }
    };

    // Main Review Manager API
    const ReviewManager = {
        ADMIN_PIN,

        async init() {
            const reviews = await Storage.getAll();
            if (!reviews || reviews.length === 0) {
                await Storage.saveAll(DEFAULT_SAMPLE_REVIEWS);
            }
        },

        async getReviews(options = {}) {
            const {
                filterRating = 'all',
                sortBy = 'newest',
                includePending = false,
                includeDemo = Storage.isDemoMode()
            } = options;

            let all = await Storage.getAll();

            // Filter demo items if demo mode is off
            if (!includeDemo) {
                all = all.filter(r => !r.isDemo);
            }

            // Filter moderation status
            if (!includePending) {
                all = all.filter(r => r.status === 'approved');
            }

            // Filter by star rating
            if (filterRating !== 'all') {
                const targetRating = parseInt(filterRating, 10);
                all = all.filter(r => r.rating === targetRating);
            }

            // Sorting
            all.sort((a, b) => {
                if (sortBy === 'highest') return b.rating - a.rating || new Date(b.date) - new Date(a.date);
                if (sortBy === 'lowest') return a.rating - b.rating || new Date(b.date) - new Date(a.date);
                // default: newest
                return new Date(b.date) - new Date(a.date);
            });

            return all;
        },

        async getStats() {
            let all = await Storage.getAll();
            const isDemo = Storage.isDemoMode();
            if (!isDemo) {
                all = all.filter(r => !r.isDemo);
            }
            const approved = all.filter(r => r.status === 'approved');
            const total = approved.length;

            if (total === 0) {
                return {
                    total: 0,
                    average: 5.0,
                    qualityAvg: 5.0,
                    websiteAvg: 5.0,
                    deliveryAvg: 5.0,
                    counts: { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 },
                    percents: { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 }
                };
            }

            const counts = { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 };
            let sumRating = 0;
            let sumQuality = 0;
            let sumWebsite = 0;
            let sumDelivery = 0;

            approved.forEach(r => {
                const rt = Math.min(5, Math.max(1, Math.round(r.rating || 5)));
                counts[rt] = (counts[rt] || 0) + 1;
                sumRating += Number(r.rating || 5);
                sumQuality += Number(r.qualityRating || r.rating || 5);
                sumWebsite += Number(r.websiteRating || r.rating || 5);
                sumDelivery += Number(r.deliveryRating || r.rating || 5);
            });

            const percents = {};
            for (let i = 1; i <= 5; i++) {
                percents[i] = Math.round((counts[i] / total) * 100);
            }

            return {
                total,
                average: Number((sumRating / total).toFixed(1)),
                qualityAvg: Number((sumQuality / total).toFixed(1)),
                websiteAvg: Number((sumWebsite / total).toFixed(1)),
                deliveryAvg: Number((sumDelivery / total).toFixed(1)),
                counts,
                percents
            };
        },

        async submitReview(data) {
            // Spam protection
            if (data.website_trap || data.honeypot) {
                throw new Error("Spam detected.");
            }
            if (!data.name || data.name.trim().length < 2) {
                throw new Error("Please enter your full name (minimum 2 characters).");
            }
            if (!data.comment || data.comment.trim().length < 10) {
                throw new Error("Please share a review of at least 10 characters.");
            }
            if (!data.rating || data.rating < 1 || data.rating > 5) {
                throw new Error("Please select a rating between 1 and 5 stars.");
            }

            // Check if customer order ID or phone matches genuine past orders in localStorage
            let isVerified = false;
            try {
                const ordersRaw = localStorage.getItem('amoura_orders');
                if (ordersRaw) {
                    const orders = JSON.parse(ordersRaw);
                    if (Array.isArray(orders)) {
                        const needle = (data.orderId || data.phone || data.email || '').toLowerCase().trim();
                        if (needle) {
                            isVerified = orders.some(o => 
                                (o.id && o.id.toLowerCase().includes(needle)) ||
                                (o.invoiceNumber && o.invoiceNumber.toLowerCase().includes(needle)) ||
                                (o.customerPhone && o.customerPhone.includes(needle)) ||
                                (o.customerEmail && o.customerEmail.toLowerCase().includes(needle))
                            );
                        }
                    }
                }
            } catch (e) {}

            const newReview = {
                id: "rev-" + Date.now() + "-" + Math.random().toString(36).substr(2, 6),
                name: data.name.trim(),
                email: (data.email || '').trim(),
                productName: data.productName || "General Experience",
                rating: Number(data.rating),
                qualityRating: Number(data.qualityRating || data.rating),
                websiteRating: Number(data.websiteRating || data.rating),
                deliveryRating: Number(data.deliveryRating || data.rating),
                comment: data.comment.trim(),
                date: new Date().toISOString().split('T')[0],
                verified: isVerified,
                isDemo: false,
                status: "pending", // Moderated
                photo: data.photo || null
            };

            // Attempt serverless save if available
            try {
                fetch('/.netlify/functions/reviews', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(newReview)
                }).catch(() => {});
            } catch (e) {}

            // Store in persistent local storage
            const all = await Storage.getAll();
            all.unshift(newReview);
            await Storage.saveAll(all);

            return {
                success: true,
                message: "Thank you for sharing your experience with Amoura Crafts! Your feedback means a lot to us.",
                review: newReview
            };
        },

        async moderateReview(id, action) {
            // action: 'approve' | 'reject' | 'delete' | 'toggle-verified'
            const all = await Storage.getAll();
            const idx = all.findIndex(r => r.id === id);
            if (idx === -1) return false;

            if (action === 'approve') {
                all[idx].status = 'approved';
            } else if (action === 'reject') {
                all[idx].status = 'rejected';
            } else if (action === 'delete') {
                all.splice(idx, 1);
            } else if (action === 'toggle-verified') {
                all[idx].verified = !all[idx].verified;
            }

            await Storage.saveAll(all);
            return true;
        },

        async getPendingReviews() {
            const all = await Storage.getAll();
            return all.filter(r => r.status === 'pending');
        },

        isDemoMode: Storage.isDemoMode,
        setDemoMode: Storage.setDemoMode,

        // Export data for committing or backing up
        async exportJSON() {
            const all = await Storage.getAll();
            return JSON.stringify(all, null, 2);
        }
    };

    // Expose globally
    window.AmouraReviews = ReviewManager;

    // Auto-init on script load
    ReviewManager.init();

})(window);

