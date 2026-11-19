// Netlify Serverless Function for Amoura Crafts Custom Products
// Connects to Google Sheets Cloud Database and Netlify Blobs
// Supports: GET, POST (Add, Update, Delete Product), DELETE

const GOOGLE_SHEET_API = "https://script.google.com/macros/s/AKfycbzdCK_Zefr3DBL3fHYp1SKmXRXudXBpLWA1EPQVR62XOijTYOKtBZpC1nCcmRQ6KxNhlw/exec";

// In-memory fallback
let inMemoryProducts = [];

function cleanProductsList(arr) {
  if (!Array.isArray(arr)) return [];
  return arr.filter(p => {
    if (!p) return false;
    const name = String(p.name || "").toLowerCase().trim();
    const desc = String(p.desc || "").toLowerCase().trim();
    const id = String(p.id || "").toLowerCase().trim();
    if (name === "sfdrtfyguhio" || desc === "fsdfmjkg" || id === "rev-14") return false;
    return true;
  });
}

function getBlobs() {
  try {
    const { getStore } = require("@netlify/blobs");
    if (getStore) {
      return getStore({ name: "amoura-products", consistency: "strong" });
    }
  } catch (e) {}
  return null;
}

exports.handler = async (event, context) => {
  const headers = {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Headers": "Content-Type",
    "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
    "Content-Type": "application/json"
  };

  if (event.httpMethod === "OPTIONS") {
    return { statusCode: 200, headers, body: "" };
  }

  const blobs = getBlobs();

  // GET: Fetch all custom products
  if (event.httpMethod === "GET") {
    let list = [];

    // 1. Try Google Sheet API
    try {
      const res = await fetch(GOOGLE_SHEET_API + "?type=products&t=" + Date.now());
      if (res.ok) {
        const raw = await res.json();
        if (Array.isArray(raw) && raw.length > 0 && raw[0].category) {
          list = raw;
        }
      }
    } catch (e) {}

    // 2. Try Netlify Blobs
    if (list.length === 0 && blobs) {
      try {
        const stored = await blobs.get("products_list", { type: "json" });
        if (Array.isArray(stored) && stored.length > 0) {
          list = stored;
        }
      } catch (e) {}
    }

    // 3. Fallback to in-memory
    if (list.length === 0) {
      list = inMemoryProducts;
    }

    const cleaned = cleanProductsList(list);

    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({ success: true, products: cleaned })
    };
  }

  // POST or PUT: Add, Update, or Delete product
  if (event.httpMethod === "POST" || event.httpMethod === "PUT") {
    try {
      const data = JSON.parse(event.body || "{}");
      const action = data.action || (data.id && inMemoryProducts.some(p => p.id === data.id) ? "updateProduct" : "addProduct");

      // CASE: DELETE PRODUCT VIA POST
      if (action === "deleteProduct") {
        const id = String(data.id || "").trim();
        const name = String(data.name || "").trim().toLowerCase();

        inMemoryProducts = inMemoryProducts.filter(p => {
          if (!p) return false;
          if (id && String(p.id).trim() === id) return false;
          if (name && String(p.name).trim().toLowerCase() === name) return false;
          return true;
        });

        if (blobs) {
          try {
            let stored = await blobs.get("products_list", { type: "json" });
            if (Array.isArray(stored)) {
              stored = stored.filter(p => {
                if (!p) return false;
                if (id && String(p.id).trim() === id) return false;
                if (name && String(p.name).trim().toLowerCase() === name) return false;
                return true;
              });
              await blobs.setJSON("products_list", stored);
            }
          } catch (e) {}
        }

        try {
          fetch(GOOGLE_SHEET_API, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ action: "deleteProduct", id, name })
          }).catch(() => {});
        } catch (e) {}

        return {
          statusCode: 200,
          headers,
          body: JSON.stringify({ success: true, message: "Product deleted successfully." })
        };
      }

      // CASE 1: UPDATE EXISTING PRODUCT
      if (action === "updateProduct") {
        if (!data.id) {
          return {
            statusCode: 400,
            headers,
            body: JSON.stringify({ error: "Product id is required for update." })
          };
        }

        const priceNum = Number(data.price) || 0;
        const mrpNum = Number(data.mrp) || Math.round(priceNum + 149);
        const category = String(data.category || "candles").toLowerCase().trim();

        let updatedProduct = null;
        inMemoryProducts = inMemoryProducts.map(p => {
          if (p.id === data.id) {
            updatedProduct = {
              ...p,
              name: data.name ? String(data.name).trim() : p.name,
              price: priceNum || p.price,
              mrp: mrpNum || p.mrp,
              category: category || p.category,
              desc: data.desc !== undefined ? String(data.desc).trim() : p.desc,
              tag: data.tag !== undefined ? String(data.tag).trim() : p.tag,
              img: (data.img && data.img.trim()) ? data.img : p.img,
              updatedAt: new Date().toISOString()
            };
            return updatedProduct;
          }
          return p;
        });

        if (!updatedProduct) {
          updatedProduct = {
            id: data.id,
            name: String(data.name || "").trim(),
            price: priceNum,
            mrp: mrpNum,
            category: category,
            desc: data.desc || "",
            tag: data.tag || "New Arrival",
            img: data.img || "images/logo.png",
            date: data.date || new Date().toISOString().split("T")[0],
            updatedAt: new Date().toISOString()
          };
          inMemoryProducts = [updatedProduct, ...inMemoryProducts];
        }

        // Update in Netlify Blobs if available
        if (blobs) {
          try {
            let stored = await blobs.get("products_list", { type: "json" });
            if (Array.isArray(stored)) {
              let found = false;
              stored = stored.map(p => {
                if (p.id === data.id) {
                  found = true;
                  return updatedProduct;
                }
                return p;
              });
              if (!found) stored.unshift(updatedProduct);
              await blobs.setJSON("products_list", cleanProductsList(stored));
            }
          } catch (e) {}
        }

        // Forward to Google Sheets database
        try {
          fetch(GOOGLE_SHEET_API, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              action: "updateProduct",
              ...updatedProduct
            })
          }).catch(() => {});
        } catch (sheetErr) {
          console.error("Sheet update error:", sheetErr);
        }

        return {
          statusCode: 200,
          headers,
          body: JSON.stringify({
            success: true,
            message: "Product updated successfully!",
            product: updatedProduct
          })
        };
      }

      // CASE 2: ADD NEW PRODUCT
      if (!data.name || !data.price) {
        return {
          statusCode: 400,
          headers,
          body: JSON.stringify({ error: "Product name and price are required." })
        };
      }

      const priceNum = Number(data.price) || 0;
      const mrpNum = Number(data.mrp) || Math.round(priceNum + 149);
      const category = String(data.category || "candles").toLowerCase().trim();

      const newProduct = {
        id: data.id || ("prod-" + Date.now() + "-" + Math.random().toString(36).substr(2, 6)),
        name: String(data.name).trim(),
        price: priceNum,
        mrp: mrpNum,
        category: category,
        desc: data.desc ? String(data.desc).trim() : `Handcrafted ${String(data.name).trim()} made with premium materials. Perfect for home decor and festive gifting.`,
        tag: data.tag ? String(data.tag).trim() : "New Arrival",
        img: data.img || "images/logo.png",
        date: data.date || new Date().toISOString().split("T")[0]
      };

      // Add to in-memory list
      inMemoryProducts = [newProduct, ...inMemoryProducts.filter(p => p.id !== newProduct.id)];

      // Persist in Netlify Blobs if available
      if (blobs) {
        try {
          let stored = await blobs.get("products_list", { type: "json" });
          if (!Array.isArray(stored)) stored = [];
          stored = [newProduct, ...stored.filter(p => p.id !== newProduct.id)];
          await blobs.setJSON("products_list", cleanProductsList(stored));
        } catch (e) {}
      }

      // Forward to Google Sheets database
      try {
        fetch(GOOGLE_SHEET_API, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            action: "addProduct",
            ...newProduct
          })
        }).catch(() => {});
      } catch (sheetErr) {
        console.error("Sheet post error:", sheetErr);
      }

      return {
        statusCode: 201,
        headers,
        body: JSON.stringify({
          success: true,
          message: "Product added successfully and published live!",
          product: newProduct
        })
      };
    } catch (err) {
      return {
        statusCode: 500,
        headers,
        body: JSON.stringify({ error: err.message || "Failed to process product." })
      };
    }
  }

  // DELETE: Remove product
  if (event.httpMethod === "DELETE") {
    try {
      const data = JSON.parse(event.body || "{}");
      const id = String(data.id || (event.queryStringParameters && event.queryStringParameters.id) || "").trim();
      const name = String(data.name || (event.queryStringParameters && event.queryStringParameters.name) || "").trim().toLowerCase();

      if (!id && !name) {
        return {
          statusCode: 400,
          headers,
          body: JSON.stringify({ error: "Product id or name is required." })
        };
      }

      inMemoryProducts = inMemoryProducts.filter(p => {
        if (!p) return false;
        if (id && String(p.id).trim() === id) return false;
        if (name && String(p.name).trim().toLowerCase() === name) return false;
        return true;
      });

      if (blobs) {
        try {
          let stored = await blobs.get("products_list", { type: "json" });
          if (Array.isArray(stored)) {
            stored = stored.filter(p => {
              if (!p) return false;
              if (id && String(p.id).trim() === id) return false;
              if (name && String(p.name).trim().toLowerCase() === name) return false;
              return true;
            });
            await blobs.setJSON("products_list", stored);
          }
        } catch (e) {}
      }

      try {
        fetch(GOOGLE_SHEET_API, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ action: "deleteProduct", id, name })
        }).catch(() => {});
      } catch (e) {}

      return {
        statusCode: 200,
        headers,
        body: JSON.stringify({ success: true, message: "Product deleted." })
      };
    } catch (err) {
      return {
        statusCode: 500,
        headers,
        body: JSON.stringify({ error: err.message || "Failed to delete product." })
      };
    }
  }

  return { statusCode: 200, headers, body: JSON.stringify({ status: "ok" }) };
};
