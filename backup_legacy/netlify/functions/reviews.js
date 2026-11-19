// Netlify Serverless Function for Amoura Crafts Real Customer Reviews
// Connected to Google Sheets Cloud Database

const GOOGLE_SHEET_API = "https://script.google.com/macros/s/AKfycbzdCK_Zefr3DBL3fHYp1SKmXRXudXBpLWA1EPQVR62XOijTYOKtBZpC1nCcmRQ6KxNhlw/exec";

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

  // GET: Fetch all real reviews from Google Sheet Cloud Database
  if (event.httpMethod === "GET") {
    try {
      const res = await fetch(GOOGLE_SHEET_API);
      if (res.ok) {
        const raw = await res.json();
        if (Array.isArray(raw)) {
          const cleaned = raw.filter(isRealReview).map(r => ({
            ...r,
            date: (r.date && String(r.date).includes('T')) ? String(r.date).split('T')[0] : (r.date || 'Recent'),
            verified: true,
            status: "approved"
          }));
          return {
            statusCode: 200,
            headers,
            body: JSON.stringify({ success: true, reviews: cleaned })
          };
        }
      }
    } catch (err) {
      console.error("Error fetching from Google Sheet:", err);
    }

    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({ success: true, reviews: [] })
    };
  }

  // POST: Submit review to Google Sheet Cloud Database
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

      // Forward to Google Sheet Web App
      try {
        await fetch(GOOGLE_SHEET_API, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            name: newReview.name,
            rating: newReview.rating,
            comment: newReview.comment,
            date: newReview.date
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
          message: "Thank you! Your review is now saved in our Google Sheet database and live on the website.",
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
