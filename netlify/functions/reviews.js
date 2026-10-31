// Netlify Serverless Function for Amoura Crafts Public Reviews
// Handles persistent cloud reviews via Netlify Blobs + in-memory cache

let inMemoryReviews = [
  {
    "id": "rev-seed-1",
    "name": "Priya Sharma",
    "productName": "Aurelia Bloom Royal Golden Floral Candle",
    "rating": 5,
    "comment": "Absolutely loved the candle! The finishing is beautiful and it looks even better in real life.",
    "date": "2026-10-24",
    "verified": true,
    "status": "approved",
    "photo": "images/thumbs/img_25.webp"
  },
  {
    "id": "rev-seed-2",
    "name": "Aarav Mehta",
    "productName": "Mayura Royal Twin Peacock Floral Panchdeep Candle",
    "rating": 5,
    "comment": "The product quality is amazing. You can clearly see the effort and creativity behind the handmade work.",
    "date": "2026-10-22",
    "verified": true,
    "status": "approved",
    "photo": "images/thumbs/img_27.webp"
  },
  {
    "id": "rev-seed-3",
    "name": "Neha Patel",
    "productName": "Velvet Heart Luxe Candle",
    "rating": 5,
    "comment": "Beautiful packaging and a premium feel. Definitely worth the price!",
    "date": "2026-10-19",
    "verified": true,
    "status": "approved",
    "photo": "images/thumbs/img_31.webp"
  },
  {
    "id": "rev-seed-4",
    "name": "Rohan Gupta",
    "productName": "Gulnaar Bloom Royal Floral Urli Candle",
    "rating": 5,
    "comment": "I ordered a floral candle and it looks stunning. Perfect for gifting and home decoration.",
    "date": "2026-10-18",
    "verified": true,
    "status": "approved",
    "photo": "images/thumbs/img_26.webp"
  },
  {
    "id": "rev-seed-5",
    "name": "Ananya Verma",
    "productName": "Crystal Botanical Bear Gel Candle",
    "rating": 5,
    "comment": "The website is easy to use, the product details are clear, and the overall shopping experience was great.",
    "date": "2026-10-15",
    "verified": true,
    "status": "approved",
    "photo": "images/thumbs/img_23.webp"
  },
  {
    "id": "rev-seed-6",
    "name": "Vikram Singh",
    "productName": "Shree Ganesha Royal Panchdeep Floral Candle",
    "rating": 5,
    "comment": "Such beautiful handcrafted products! The detailing and finishing are impressive.",
    "date": "2026-10-12",
    "verified": true,
    "status": "approved",
    "photo": "images/thumbs/img_29.webp"
  },
  {
    "id": "rev-seed-7",
    "name": "Kavita Joshi",
    "productName": "Mandala Glow Artisanal Brass-Footed Candle",
    "rating": 5,
    "comment": "I really loved the design and fragrance of the candle. Would definitely love to explore more products.",
    "date": "2026-10-09",
    "verified": true,
    "status": "approved",
    "photo": "images/thumbs/img_24.webp"
  },
  {
    "id": "rev-seed-8",
    "name": "Deepak Nair",
    "productName": "Celestial Aura Lotus Floating Diya Candle",
    "rating": 5,
    "comment": "A wonderful collection of handmade candles and resin art. Everything looks elegant and unique.",
    "date": "2026-10-06",
    "verified": true,
    "status": "approved",
    "photo": "images/thumbs/img_30.webp"
  },
  {
    "id": "rev-seed-9",
    "name": "Simran Kaur",
    "productName": "Noor Royal Carved Column Pillar Candle",
    "rating": 5,
    "comment": "The product was beautifully presented and made a lovely gift. Very happy with my experience.",
    "date": "2026-10-02",
    "verified": true,
    "status": "approved",
    "photo": "images/thumbs/img_28.webp"
  },
  {
    "id": "rev-seed-10",
    "name": "Pooja Malhotra",
    "productName": "Pastel Bliss Hand-Sculpted Blossom Candle",
    "rating": 5,
    "comment": "Amoura Crafts has a lovely collection. The designs are creative, elegant and perfect for special occasions.",
    "date": "2026-09-28",
    "verified": true,
    "status": "approved",
    "photo": "images/thumbs/img_32.webp"
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

  // GET: Fetch all public customer reviews
  if (event.httpMethod === "GET") {
    try {
      let list = inMemoryReviews;
      if (blobs) {
        try {
          const stored = await blobs.get("reviews_list", { type: "json" });
          if (Array.isArray(stored) && stored.length > 0) {
            list = stored;
          }
        } catch (e) {}
      }
      return {
        statusCode: 200,
        headers,
        body: JSON.stringify({ success: true, reviews: list })
      };
    } catch (err) {
      return {
        statusCode: 200,
        headers,
        body: JSON.stringify({ success: true, reviews: inMemoryReviews })
      };
    }
  }

  // POST: Submit a new customer review (100% public, auto-approved)
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
        status: "approved", // Immediately live and visible to all public!
        photo: data.photo || null
      };

      // Add to in-memory list
      inMemoryReviews = [newReview, ...inMemoryReviews.filter(r => r.id !== newReview.id)];

      // Persist in Netlify Blobs if available
      if (blobs) {
        try {
          let stored = await blobs.get("reviews_list", { type: "json" });
          if (!Array.isArray(stored)) {
            stored = inMemoryReviews;
          } else {
            stored = [newReview, ...stored.filter(r => r.id !== newReview.id)];
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
