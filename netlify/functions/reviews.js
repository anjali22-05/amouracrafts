// Netlify Serverless Function for Amoura Crafts Real Customer Reviews
// Handles persistent cloud reviews via Netlify Blobs + in-memory cache

const FAKE_NAMES = [
  'Priya Sharma', 'Aarav Mehta', 'Neha Patel', 'Rohan Gupta',
  'Ananya Verma', 'Vikram Singh', 'Kavita Joshi', 'Deepak Nair',
  'Simran Kaur', 'Pooja Malhotra', 'Test Verification'
];

function isRealReview(r) {
  if (!r || !r.name) return false;
  if (r.isDemo === true) return false;
  if (r.id && (String(r.id).startsWith('rev-demo') || String(r.id).startsWith('rev-seed'))) return false;
  if (FAKE_NAMES.includes(String(r.name).trim())) return false;
  return true;
}

// Initialized with genuine client reviews
let inMemoryReviews = [
  {
    "id": "rev-1793467604837-u6ap0v",
    "name": "abhishek",
    "rating": 5,
    "comment": "Please buy scented candles quality is awasome",
    "productName": "Amoura Crafts",
    "date": "2026-10-31",
    "verified": true,
    "status": "approved",
    "photo": null
  }
];

function getBlobs() {
  try {
    const { getStore } = require("@netlify/blobs");
    if (getStore) {
      return getStore({ name: "amoura-customer-reviews", consistency: "strong" });
    }
  } catch (e) {}
  return null;
}

exports.handler = async (event, context) => {
  const headers = {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Headers": "Content-Type",
    "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
    "Content-Type": "application/json"
  };

  if (event.httpMethod === "OPTIONS") {
    return { statusCode: 200, headers, body: "" };
  }

  const blobs = getBlobs();

  // GET: Fetch all real public customer reviews
  if (event.httpMethod === "GET") {
    try {
      let list = inMemoryReviews;
      if (blobs) {
        try {
          const stored = await blobs.get("reviews_list", { type: "json" });
          if (Array.isArray(stored) && stored.length > 0) {
            // Filter out any leftover fake reviews from old tests
            list = stored.filter(isRealReview);
          }
        } catch (e) {}
      }

      list = list.filter(isRealReview);

      return {
        statusCode: 200,
        headers,
        body: JSON.stringify({ success: true, reviews: list })
      };
    } catch (err) {
      return {
        statusCode: 200,
        headers,
        body: JSON.stringify({ success: true, reviews: inMemoryReviews.filter(isRealReview) })
      };
    }
  }

  // POST: Submit a new genuine customer review (auto-approved & public)
  if (event.httpMethod === "POST") {
    try {
      const data = JSON.parse(event.body || "{}");

      // Spam check
      if (data.website_trap || data.honeypot || data.honeypot_trap) {
        return {
          statusCode: 400,
          headers,
          body: JSON.stringify({ error: "Spam detected." })
        };
      }

      if (!data.name || data.name.trim().length < 2) {
        return {
          statusCode: 400,
          headers,
          body: JSON.stringify({ error: "Valid customer name is required." })
        };
      }

      if (!data.comment || data.comment.trim().length < 10) {
        return {
          statusCode: 400,
          headers,
          body: JSON.stringify({ error: "Feedback message must be at least 10 characters." })
        };
      }

      const newReview = {
        id: data.id || "rev-" + Date.now() + "-" + Math.random().toString(36).substr(2, 6),
        name: data.name.trim(),
        rating: Math.min(5, Math.max(1, Number(data.rating || 5))),
        comment: data.comment.trim(),
        productName: data.productName ? data.productName.trim() : "Amoura Crafts",
        date: data.date || new Date().toISOString().split("T")[0],
        verified: true,
        isDemo: false,
        status: "approved",
        photo: data.photo || null
      };

      // Add to in-memory list (only real reviews)
      inMemoryReviews = [newReview, ...inMemoryReviews.filter(r => r.id !== newReview.id && isRealReview(r))];

      // Persist in Netlify Blobs
      if (blobs) {
        try {
          let stored = await blobs.get("reviews_list", { type: "json" });
          if (!Array.isArray(stored)) {
            stored = inMemoryReviews;
          } else {
            stored = [newReview, ...stored.filter(r => r.id !== newReview.id && isRealReview(r))];
          }
          await blobs.setJSON("reviews_list", stored);
        } catch (e) {}
      }

      return {
        statusCode: 201,
        headers,
        body: JSON.stringify({
          success: true,
          message: "Thank you! Your review is now live on our website.",
          review: newReview
        })
      };
    } catch (err) {
      return {
        statusCode: 500,
        headers,
        body: JSON.stringify({ error: err.message || "Failed to process review." })
      };
    }
  }

  return { statusCode: 200, headers, body: JSON.stringify({ status: "ok" }) };
};
