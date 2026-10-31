// Netlify Serverless Function for Amoura Crafts Reviews
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

  if (event.httpMethod === "POST") {
    try {
      const data = JSON.parse(event.body || "{}");

      // Honeypot spam protection
      if (data.website_trap || data.honeypot) {
        return {
          statusCode: 400,
          headers,
          body: JSON.stringify({ error: "Spam detected." })
        };
      }

      // Basic validation
      if (!data.name || data.name.trim().length < 2) {
        return {
          statusCode: 400,
          headers,
          body: JSON.stringify({ error: "Valid name is required." })
        };
      }
      if (!data.comment || data.comment.trim().length < 10) {
        return {
          statusCode: 400,
          headers,
          body: JSON.stringify({ error: "Review comment must be at least 10 characters." })
        };
      }
      if (!data.rating || data.rating < 1 || data.rating > 5) {
        return {
          statusCode: 400,
          headers,
          body: JSON.stringify({ error: "Rating must be between 1 and 5." })
        };
      }

      const review = {
        id: "rev-" + Date.now() + "-" + Math.random().toString(36).substr(2, 6),
        name: data.name.trim(),
        email: (data.email || "").trim(),
        productName: data.productName || "General Experience",
        rating: Number(data.rating),
        qualityRating: Number(data.qualityRating || data.rating),
        websiteRating: Number(data.websiteRating || data.rating),
        deliveryRating: Number(data.deliveryRating || data.rating),
        comment: data.comment.trim(),
        date: new Date().toISOString().split("T")[0],
        verified: Boolean(data.verified),
        isDemo: false,
        status: "pending", // Moderation required
        photo: data.photo || null
      };

      return {
        statusCode: 201,
        headers,
        body: JSON.stringify({
          success: true,
          message: "Thank you for sharing your experience with Amoura Crafts! Your feedback means a lot to us.",
          review
        })
      };
    } catch (err) {
      return {
        statusCode: 500,
        headers,
        body: JSON.stringify({ error: err.message || "Server error processing review." })
      };
    }
  }

  return {
    statusCode: 200,
    headers,
    body: JSON.stringify({ status: "ok", service: "Amoura Crafts Reviews API" })
  };
};

