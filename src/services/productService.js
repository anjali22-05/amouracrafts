/**
 * Amoura Crafts - Product Service
 * High-performance client-side product synchronization engine.
 * Connects Admin Portal, Netlify Serverless Backend, and Google Sheets Cloud Database.
 * Guarantees 0ms instant display via IndexedDB/LocalStorage with real-time cloud sync.
 */

const STORAGE_KEY = 'amoura_custom_products_v1';
const DELETED_KEY = 'amoura_deleted_product_ids_v1';
const IDB_NAME = 'amoura_products_db';
const IDB_VERSION = 1;
const STORE_NAME = 'custom_products';
const NETLIFY_API = '/.netlify/functions/products';
const GOOGLE_SHEET_API = "https://script.google.com/macros/s/AKfycbzdCK_Zefr3DBL3fHYp1SKmXRXudXBpLWA1EPQVR62XOijTYOKtBZpC1nCcmRQ6KxNhlw/exec";

// Blacklisted / deleted product identifiers to permanently eliminate
export function getDeletedSet() {
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

export function recordDeleted(id, name) {
  try {
    const current = getDeletedSet();
    if (id) current.add(String(id).toLowerCase().trim());
    if (name) current.add(String(name).toLowerCase().trim());
    localStorage.setItem(DELETED_KEY, JSON.stringify(Array.from(current)));
  } catch (e) {}
}

export function filterOutDeleted(list) {
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

function openIDB() {
  return new Promise((resolve) => {
    if (typeof window === 'undefined' || !window.indexedDB) return resolve(null);
    try {
      const req = indexedDB.open(IDB_NAME, IDB_VERSION);
      req.onupgradeneeded = (e) => {
        const db = e.target.result;
        if (!db.objectStoreNames.contains(STORE_NAME)) {
          db.createObjectStore(STORE_NAME, { keyPath: 'id' });
        }
      };
      req.onsuccess = () => resolve(req.result);
      req.onerror = () => resolve(null);
    } catch (e) {
      resolve(null);
    }
  });
}

export const Storage = {
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

    if (typeof window !== 'undefined') {
      window.dispatchEvent(new CustomEvent('amoura_products_changed', { detail: clean }));
    }
  }
};

export const productService = {
  async getProducts(onCloudUpdate = null) {
    const local = await Storage.getAll();

    // Background sync from Cloud
    (async () => {
      let remote = null;

      try {
        const res = await fetch(NETLIFY_API + '?t=' + Date.now());
        if (res.ok) {
          const data = await res.json();
          if (data && Array.isArray(data.products)) {
            remote = filterOutDeleted(data.products);
          }
        }
      } catch (e) {}

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
      img: prod.img || "/images/logo.png",
      date: prod.date || new Date().toISOString().split('T')[0]
    };

    const current = await Storage.getAll();
    const updated = [newProduct, ...current.filter(p => p.id !== newProduct.id)];
    await Storage.saveAll(updated);

    try {
      fetch(NETLIFY_API, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'addProduct', ...newProduct })
      }).catch(() => {});
    } catch (e) {}

    try {
      fetch(GOOGLE_SHEET_API, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: "addProduct", ...newProduct })
      }).catch(() => {});
    } catch (e) {}

    return newProduct;
  },

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

    current[existingIndex] = updatedProduct;
    await Storage.saveAll(current);

    try {
      fetch(NETLIFY_API, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'updateProduct', ...updatedProduct })
      }).catch(() => {});
    } catch (e) {}

    try {
      fetch(GOOGLE_SHEET_API, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'updateProduct', ...updatedProduct })
      }).catch(() => {});
    } catch (e) {}

    return updatedProduct;
  },

  async deleteProduct(id, name = '') {
    if (!id && !name) return false;

    const targetId = String(id || '').trim();
    const targetName = String(name || '').trim().toLowerCase();

    recordDeleted(targetId, targetName);

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

    try {
      fetch(NETLIFY_API, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'deleteProduct', id: targetId, name: targetName })
      }).catch(() => {});
    } catch (e) {}

    try {
      fetch(GOOGLE_SHEET_API, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: "deleteProduct", id: targetId, name: targetName })
      }).catch(() => {});
    } catch (e) {}

    return true;
  }
};

export function compressImageFile(file, maxWidth = 800, maxHeight = 800, quality = 0.82) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onerror = reject;
    reader.onload = (e) => {
      const img = new Image();
      img.onerror = reject;
      img.onload = () => {
        let width = img.width;
        let height = img.height;

        if (width > maxWidth || height > maxHeight) {
          if (width / height > maxWidth / maxHeight) {
            height = Math.round(height * (maxWidth / width));
            width = maxWidth;
          } else {
            width = Math.round(width * (maxHeight / height));
            height = maxHeight;
          }
        }

        const canvas = document.createElement('canvas');
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        ctx.drawImage(img, 0, 0, width, height);

        let dataUrl = '';
        try {
          dataUrl = canvas.toDataURL('image/webp', quality);
        } catch (err) {}
        if (!dataUrl || !dataUrl.startsWith('data:image/webp')) {
          dataUrl = canvas.toDataURL('image/jpeg', quality);
        }

        resolve(dataUrl);
      };
      img.src = e.target.result;
    };
    reader.readAsDataURL(file);
  });
}
