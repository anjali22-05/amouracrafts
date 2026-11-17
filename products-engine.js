/**
 * Amoura Crafts - Products Engine (products-engine.js)
 * High-performance client-side product synchronization engine.
 * Connects Admin Portal, Netlify Serverless Backend, and Google Sheets Cloud Database.
 * Guarantees 0ms instant display via IndexedDB/LocalStorage with real-time cloud sync.
 */

(function (window) {
    const STORAGE_KEY = 'amoura_custom_products_v1';
    const IDB_NAME = 'amoura_products_db';
    const IDB_VERSION = 1;
    const STORE_NAME = 'custom_products';
    const NETLIFY_API = '/.netlify/functions/products';
    const GOOGLE_SHEET_API = "https://script.google.com/macros/s/AKfycbzdCK_Zefr3DBL3fHYp1SKmXRXudXBpLWA1EPQVR62XOijTYOKtBZpC1nCcmRQ6KxNhlw/exec";

    // Open IndexedDB
    function openIDB() {
        return new Promise((resolve) => {
            if (!window.indexedDB) return resolve(null);
            const req = indexedDB.open(IDB_NAME, IDB_VERSION);
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
            return Array.isArray(list) ? list : [];
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

        async saveAll(products) {
            if (!Array.isArray(products)) return;
            try {
                localStorage.setItem(STORAGE_KEY, JSON.stringify(products));
            } catch (e) {}

            try {
                const db = await openIDB();
                if (db) {
                    const tx = db.transaction(STORE_NAME, 'readwrite');
                    const store = tx.objectStore(STORE_NAME);
                    store.clear();
                    products.forEach(p => store.put(p));
                }
            } catch (e) {}
        }
    };

    const ProductManager = {
        // Fetch products with multi-tier cloud fallbacks
        async getProducts(onCloudUpdate = null) {
            // 1. Return cached products instantly (0ms)
            const local = await Storage.getAll();

            // 2. Background sync from Cloud
            (async () => {
                let remote = [];

                // Try Netlify serverless function first
                try {
                    const res = await fetch(NETLIFY_API + '?t=' + Date.now());
                    if (res.ok) {
                        const data = await res.json();
                        if (Array.isArray(data.products) && data.products.length > 0) {
                            remote = data.products;
                        }
                    }
                } catch (e) {}

                // If Netlify function returned nothing, try Google Sheets API directly
                if (remote.length === 0) {
                    try {
                        const res = await fetch(GOOGLE_SHEET_API + '?type=products&t=' + Date.now());
                        if (res.ok) {
                            const raw = await res.json();
                            if (Array.isArray(raw) && raw.length > 0 && raw[0].category) {
                                remote = raw;
                            }
                        }
                    } catch (e) {}
                }

                // If remote returned valid products, compare and update
                if (remote.length > 0) {
                    const remoteStr = JSON.stringify(remote);
                    const localStr = JSON.stringify(local);
                    if (remoteStr !== localStr) {
                        await Storage.saveAll(remote);
                        if (typeof onCloudUpdate === 'function') {
                            onCloudUpdate(remote);
                        }
                    }
                }
            })();

            return local;
        },

        // Add a new product
        async addProduct(prod) {
            if (!prod || !prod.name || !prod.price) {
                throw new Error("Product name and price are required.");
            }

            const priceNum = Number(prod.price) || 0;
            const mrpNum = Number(prod.mrp) || Math.round(priceNum + 149);
            const category = String(prod.category || 'candles').toLowerCase().trim();

            const newProduct = {
                id: prod.id || ('prod-' + Date.now() + '-' + Math.random().toString(36).substr(2, 6)),
                name: String(prod.name).trim(),
                price: priceNum,
                mrp: mrpNum,
                category: category,
                desc: prod.desc ? String(prod.desc).trim() : `Handcrafted ${String(prod.name).trim()} made with premium materials. Perfect for home decor and festive gifting.`,
                tag: prod.tag ? String(prod.tag).trim() : "New Arrival",
                img: prod.img || "images/logo.png",
                date: prod.date || new Date().toISOString().split('T')[0]
            };

            // Save locally immediately
            const current = await Storage.getAll();
            const updated = [newProduct, ...current.filter(p => p.id !== newProduct.id)];
            await Storage.saveAll(updated);

            // Forward to Netlify serverless function
            try {
                fetch(NETLIFY_API, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(newProduct)
                }).catch(() => {});
            } catch (e) {}

            // Forward to Google Sheets database
            try {
                fetch(GOOGLE_SHEET_API, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        action: "addProduct",
                        ...newProduct
                    })
                }).catch(() => {});
            } catch (e) {}

            return newProduct;
        },

        // Update an existing product
        async updateProduct(prod) {
            if (!prod || !prod.id) {
                throw new Error("Product ID is required for update.");
            }

            const current = await Storage.getAll();
            const existingIndex = current.findIndex(p => p.id === prod.id);
            if (existingIndex === -1) {
                throw new Error("Product not found.");
            }

            const existing = current[existingIndex];
            const priceNum = Number(prod.price !== undefined ? prod.price : existing.price) || 0;
            const mrpNum = Number(prod.mrp !== undefined ? prod.mrp : existing.mrp) || Math.round(priceNum + 149);
            const category = String(prod.category !== undefined ? prod.category : existing.category).toLowerCase().trim();

            const updatedProduct = {
                ...existing,
                name: prod.name ? String(prod.name).trim() : existing.name,
                price: priceNum,
                mrp: mrpNum,
                category: category,
                desc: prod.desc !== undefined ? String(prod.desc).trim() : existing.desc,
                tag: prod.tag !== undefined ? String(prod.tag).trim() : existing.tag,
                img: (prod.img && prod.img.trim()) ? prod.img : existing.img,
                updatedAt: new Date().toISOString()
            };

            // Update in local cache
            current[existingIndex] = updatedProduct;
            await Storage.saveAll(current);

            // Forward to Netlify serverless function
            try {
                fetch(NETLIFY_API, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        action: 'updateProduct',
                        ...updatedProduct
                    })
                }).catch(() => {});
            } catch (e) {}

            // Forward to Google Sheets database
            try {
                fetch(GOOGLE_SHEET_API, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        action: 'updateProduct',
                        ...updatedProduct
                    })
                }).catch(() => {});
            } catch (e) {}

            return updatedProduct;
        },

        // Delete a product
        async deleteProduct(id) {
            if (!id) return;
            const current = await Storage.getAll();
            const updated = current.filter(p => p.id !== id);
            await Storage.saveAll(updated);

            // Forward DELETE to Netlify API
            try {
                fetch(NETLIFY_API, {
                    method: 'DELETE',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ id })
                }).catch(() => {});
            } catch (e) {}

            // Forward DELETE to Google Sheets
            try {
                fetch(GOOGLE_SHEET_API, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ action: "deleteProduct", id })
                }).catch(() => {});
            } catch (e) {}

            return true;
        },

        // Sync helper for index.html (Candles & Resin Art)
        async syncWithIndexPage(PRODUCTS_ARR, RESIN_PRODUCTS_ARR, renderCandlesFn, renderResinFn, initBulkFn) {
            function injectProducts(customList) {
                let candlesChanged = false;
                let resinChanged = false;

                customList.forEach(p => {
                    const cat = (p.category || 'candles').toLowerCase();
                    if (cat === 'resin') {
                        const existingIdx = RESIN_PRODUCTS_ARR.findIndex(item => item.id === p.id);
                        if (existingIdx >= 0) {
                            Object.assign(RESIN_PRODUCTS_ARR[existingIdx], p);
                            resinChanged = true;
                        } else {
                            RESIN_PRODUCTS_ARR.unshift(p);
                            resinChanged = true;
                        }
                        // Remove from candles if it was previously categorized as candles
                        const oldCandleIdx = PRODUCTS_ARR.findIndex(item => item.id === p.id);
                        if (oldCandleIdx >= 0) {
                            PRODUCTS_ARR.splice(oldCandleIdx, 1);
                            candlesChanged = true;
                        }
                    } else if (cat === 'candles') {
                        const existingIdx = PRODUCTS_ARR.findIndex(item => item.id === p.id);
                        if (existingIdx >= 0) {
                            Object.assign(PRODUCTS_ARR[existingIdx], p);
                            candlesChanged = true;
                        } else {
                            PRODUCTS_ARR.unshift(p);
                            candlesChanged = true;
                        }
                        // Remove from resin if it was previously categorized as resin
                        const oldResinIdx = RESIN_PRODUCTS_ARR.findIndex(item => item.id === p.id);
                        if (oldResinIdx >= 0) {
                            RESIN_PRODUCTS_ARR.splice(oldResinIdx, 1);
                            resinChanged = true;
                        }
                    }
                });

                if (candlesChanged && typeof renderCandlesFn === 'function') {
                    renderCandlesFn();
                    if (typeof initBulkFn === 'function') initBulkFn();
                }
                if (resinChanged && typeof renderResinFn === 'function') {
                    renderResinFn();
                }
            }

            // 1. Apply cached products right away
            const cached = await ProductManager.getProducts((remoteList) => {
                injectProducts(remoteList);
            });
            injectProducts(cached);
        },

        // Sync helper for plants.html (Tree & Plants)
        async syncWithPlantsPage(PLANTS_ARR, renderPlantsFn, initBulkFn) {
            function injectProducts(customList) {
                let plantsChanged = false;

                customList.forEach(p => {
                    const cat = (p.category || '').toLowerCase();
                    if (cat === 'plants') {
                        const existingIdx = PLANTS_ARR.findIndex(item => item.id === p.id);
                        if (existingIdx >= 0) {
                            Object.assign(PLANTS_ARR[existingIdx], p);
                            plantsChanged = true;
                        } else {
                            PLANTS_ARR.unshift(p);
                            plantsChanged = true;
                        }
                    }
                });

                if (plantsChanged && typeof renderPlantsFn === 'function') {
                    renderPlantsFn();
                    if (typeof initBulkFn === 'function') initBulkFn();
                }
            }

            // 1. Apply cached products right away
            const cached = await ProductManager.getProducts((remoteList) => {
                injectProducts(remoteList);
            });
            injectProducts(cached);
        }
    };

    window.ProductManager = ProductManager;
})(window);
