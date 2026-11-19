/**
 * Amoura Crafts - Products Engine (products-engine.js)
 * High-performance client-side product synchronization engine.
 * Connects Admin Portal, Netlify Serverless Backend, and Google Sheets Cloud Database.
 * Guarantees 0ms instant display via IndexedDB/LocalStorage with real-time cloud sync.
 */

(function (window) {
    const STORAGE_KEY = 'amoura_custom_products_v1';
    const DELETED_KEY = 'amoura_deleted_product_ids_v1';
    const IDB_NAME = 'amoura_products_db';
    const IDB_VERSION = 1;
    const STORE_NAME = 'custom_products';
    const NETLIFY_API = '/.netlify/functions/products';
    const GOOGLE_SHEET_API = "https://script.google.com/macros/s/AKfycbzdCK_Zefr3DBL3fHYp1SKmXRXudXBpLWA1EPQVR62XOijTYOKtBZpC1nCcmRQ6KxNhlw/exec";

    // Blacklisted / deleted product identifiers to permanently eliminate
    function getDeletedSet() {
        const set = new Set(['sfdrtfyguhio', 'rev-14', 'fsdfmjkg']);
        try {
            const raw = localStorage.getItem(DELETED_KEY);
            if (raw) {
                const arr = JSON.parse(raw);
                if (Array.isArray(arr)) {
                    arr.forEach(item => {
                        if (item) set.add(String(item).toLowerCase().trim());
                    });
                }
            }
        } catch (e) {}
        return set;
    }

    function recordDeleted(id, name) {
        try {
            const current = getDeletedSet();
            if (id) current.add(String(id).toLowerCase().trim());
            if (name) current.add(String(name).toLowerCase().trim());
            localStorage.setItem(DELETED_KEY, JSON.stringify(Array.from(current)));
        } catch (e) {}
    }

    function filterOutDeleted(list) {
        if (!Array.isArray(list)) return [];
        const deleted = getDeletedSet();
        return list.filter(p => {
            if (!p) return false;
            const pId = String(p.id || '').toLowerCase().trim();
            const pName = String(p.name || '').toLowerCase().trim();
            const pDesc = String(p.desc || '').toLowerCase().trim();
            if (deleted.has(pId)) return false;
            if (deleted.has(pName)) return false;
            if (pName === 'sfdrtfyguhio' || pDesc === 'fsdfmjkg') return false;
            return true;
        });
    }

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
            return filterOutDeleted(list);
        },

        getFromLocalStorage() {
            try {
                const raw = localStorage.getItem(STORAGE_KEY);
                if (raw) {
                    const parsed = JSON.parse(raw);
                    if (Array.isArray(parsed)) return filterOutDeleted(parsed);
                }
            } catch (e) {}
            return [];
        },

        async saveAll(products) {
            const clean = filterOutDeleted(products);
            try {
                localStorage.setItem(STORAGE_KEY, JSON.stringify(clean));
            } catch (e) {}

            try {
                const db = await openIDB();
                if (db) {
                    const tx = db.transaction(STORE_NAME, 'readwrite');
                    const store = tx.objectStore(STORE_NAME);
                    store.clear();
                    clean.forEach(p => store.put(p));
                }
            } catch (e) {}

            try {
                window.dispatchEvent(new CustomEvent('amoura_products_changed', { detail: clean }));
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
                let remote = null;

                // Try Netlify serverless function first
                try {
                    const res = await fetch(NETLIFY_API + '?t=' + Date.now());
                    if (res.ok) {
                        const data = await res.json();
                        if (data && Array.isArray(data.products)) {
                            remote = filterOutDeleted(data.products);
                        }
                    }
                } catch (e) {}

                // If Netlify function returned nothing or failed, try Google Sheets API directly
                if (remote === null) {
                    try {
                        const res = await fetch(GOOGLE_SHEET_API + '?type=products&t=' + Date.now());
                        if (res.ok) {
                            const raw = await res.json();
                            if (Array.isArray(raw) && raw.length > 0 && raw[0].category) {
                                remote = filterOutDeleted(raw);
                            }
                        }
                    } catch (e) {}
                }

                // If remote returned valid product list (even if empty, representing deleted state)
                if (Array.isArray(remote)) {
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
                    body: JSON.stringify({ action: 'addProduct', ...newProduct })
                }).catch(() => {});
            } catch (e) {}

            // Forward to Google Sheets database
            try {
                fetch(GOOGLE_SHEET_API, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ action: "addProduct", ...newProduct })
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
            const existingIndex = current.findIndex(p => String(p.id).trim() === String(prod.id).trim());
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
                    body: JSON.stringify({ action: 'updateProduct', ...updatedProduct })
                }).catch(() => {});
            } catch (e) {}

            // Forward to Google Sheets database
            try {
                fetch(GOOGLE_SHEET_API, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ action: 'updateProduct', ...updatedProduct })
                }).catch(() => {});
            } catch (e) {}

            return updatedProduct;
        },

        // Delete a product (by id and optional name)
        async deleteProduct(id, name = '') {
            if (!id && !name) return false;

            const targetId = String(id || '').trim();
            const targetName = String(name || '').trim().toLowerCase();

            // 1. Record in persistent deleted blacklist
            recordDeleted(targetId, targetName);

            // 2. Remove from local Storage
            const current = await Storage.getAll();
            const updated = current.filter(p => {
                if (!p) return false;
                const pId = String(p.id || '').trim();
                const pName = String(p.name || '').trim().toLowerCase();
                if (targetId && pId === targetId) return false;
                if (targetName && pName === targetName) return false;
                return true;
            });
            await Storage.saveAll(updated);

            // 3. Forward DELETE to Netlify API via both DELETE and POST
            try {
                fetch(NETLIFY_API + '?id=' + encodeURIComponent(targetId), {
                    method: 'DELETE',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ id: targetId, name: targetName })
                }).catch(() => {});
            } catch (e) {}

            try {
                fetch(NETLIFY_API, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ action: 'deleteProduct', id: targetId, name: targetName })
                }).catch(() => {});
            } catch (e) {}

            // 4. Forward DELETE to Google Sheets
            try {
                fetch(GOOGLE_SHEET_API, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ action: 'deleteProduct', id: targetId, name: targetName })
                }).catch(() => {});
            } catch (e) {}

            return true;
        },

        // Sync helper for index.html (Candles & Resin Art)
        async syncWithIndexPage(PRODUCTS_ARR, RESIN_PRODUCTS_ARR, renderCandlesFn, renderResinFn, initBulkFn) {
            function injectProducts(customList) {
                const cleanList = filterOutDeleted(customList);
                const validIds = new Set(cleanList.map(p => String(p.id)));
                let candlesChanged = false;
                let resinChanged = false;

                // 1. Purge deleted or unlisted custom products from candles
                for (let i = PRODUCTS_ARR.length - 1; i >= 0; i--) {
                    const item = PRODUCTS_ARR[i];
                    if (item && item.id) {
                        const idStr = String(item.id);
                        const nameStr = String(item.name || '').toLowerCase().trim();
                        if (nameStr === 'sfdrtfyguhio' || (idStr.startsWith('prod-') && !validIds.has(idStr))) {
                            PRODUCTS_ARR.splice(i, 1);
                            candlesChanged = true;
                        }
                    }
                }

                // 2. Purge deleted or unlisted custom products from resin
                for (let i = RESIN_PRODUCTS_ARR.length - 1; i >= 0; i--) {
                    const item = RESIN_PRODUCTS_ARR[i];
                    if (item && item.id) {
                        const idStr = String(item.id);
                        const nameStr = String(item.name || '').toLowerCase().trim();
                        if (nameStr === 'sfdrtfyguhio' || (idStr.startsWith('prod-') && !validIds.has(idStr))) {
                            RESIN_PRODUCTS_ARR.splice(i, 1);
                            resinChanged = true;
                        }
                    }
                }

                // 3. Inject / Update active custom products
                cleanList.forEach(p => {
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

            // Real-time synchronization when products change in other tabs
            window.addEventListener('storage', (e) => {
                if (e.key === STORAGE_KEY || e.key === DELETED_KEY) {
                    ProductManager.getProducts().then(list => injectProducts(list));
                }
            });
            window.addEventListener('amoura_products_changed', (e) => {
                if (e.detail) injectProducts(e.detail);
            });

            // Apply cached products immediately (0ms) and register cloud callback
            const cached = await ProductManager.getProducts((remoteList) => {
                injectProducts(remoteList);
            });
            injectProducts(cached);
        },

        // Sync helper for plants.html (Tree & Plants)
        async syncWithPlantsPage(PLANTS_ARR, renderPlantsFn, initBulkFn) {
            function injectProducts(customList) {
                const cleanList = filterOutDeleted(customList);
                const validIds = new Set(cleanList.map(p => String(p.id)));
                let plantsChanged = false;

                // 1. Purge deleted or unlisted custom products from plants
                for (let i = PLANTS_ARR.length - 1; i >= 0; i--) {
                    const item = PLANTS_ARR[i];
                    if (item && item.id) {
                        const idStr = String(item.id);
                        const nameStr = String(item.name || '').toLowerCase().trim();
                        if (nameStr === 'sfdrtfyguhio' || (idStr.startsWith('prod-') && !validIds.has(idStr))) {
                            PLANTS_ARR.splice(i, 1);
                            plantsChanged = true;
                        }
                    }
                }

                // 2. Inject / Update active custom products
                cleanList.forEach(p => {
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

            // Real-time synchronization when products change in other tabs
            window.addEventListener('storage', (e) => {
                if (e.key === STORAGE_KEY || e.key === DELETED_KEY) {
                    ProductManager.getProducts().then(list => injectProducts(list));
                }
            });
            window.addEventListener('amoura_products_changed', (e) => {
                if (e.detail) injectProducts(e.detail);
            });

            // Apply cached products immediately (0ms) and register cloud callback
            const cached = await ProductManager.getProducts((remoteList) => {
                injectProducts(remoteList);
            });
            injectProducts(cached);
        }
    };

    window.ProductManager = ProductManager;
})(window);
