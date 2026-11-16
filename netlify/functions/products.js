// Netlify Serverless Function for Amoura Crafts Custom Products
// Connects to Google Sheets Cloud Database and Netlify Blobs

const GOOGLE_SHEET_API = "https://script.google.com/macros/s/AKfycbzdCK_Zefr3DBL3fHYp1SKmXRXudXBpLWA1EPQVR62XOijTYOKtBZpC1nCcmRQ6KxNhlw/exec";

// In-memory fallback
let inMemoryProducts = [];

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
    "Access-Control-Allow-Methods": "GET, POST, DELETE, OPTIONS",
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

    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({ success: true, products: list })
    };
  }

  // POST: Add new custom product
  if (event.httpMethod === "POST") {
    try {
      const data = JSON.parse(event.body || "{}");

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
          await blobs.setJSON("products_list", stored);
        } catch (e) {}
      }

      // Forward to Google Sheets database
      try {
        await fetch(GOOGLE_SHEET_API, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            action: "addProduct",
            ...newProduct
          })
        });
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
      const id = data.id;

      if (!id) {
        return {
          statusCode: 400,
          headers,
          body: JSON.stringify({ error: "Product id is required." })
        };
      }

      inMemoryProducts = inMemoryProducts.filter(p => p.id !== id);

      if (blobs) {
        try {
          let stored = await blobs.get("products_list", { type: "json" });
          if (Array.isArray(stored)) {
            stored = stored.filter(p => p.id !== id);
            await blobs.setJSON("products_list", stored);
          }
        } catch (e) {}
      }

      try {
        await fetch(GOOGLE_SHEET_API, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ action: "deleteProduct", id })
        });
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
