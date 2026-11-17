// Netlify Serverless Function for Amoura Crafts Admin Authentication
// Secure PBKDF2 Password Hashing with Zero Frontend Password Exposure

const crypto = require("crypto");

// Secret key for signing session tokens (timing-safe HMAC)
const SERVER_SECRET = process.env.ADMIN_JWT_SECRET || "amoura_crafts_luxury_secret_key_2026_x89";
const GOOGLE_SHEET_API = "https://script.google.com/macros/s/AKfycbzdCK_Zefr3DBL3fHYp1SKmXRXudXBpLWA1EPQVR62XOijTYOKtBZpC1nCcmRQ6KxNhlw/exec";

// Initial PBKDF2 (SHA-512, 10,000 iterations) hash
// Plaintext password is NEVER stored or hardcoded in source code!
const DEFAULT_AUTH = {
  salt: "a921f18b36a9e4c138d074c81a13b7b4",
  hash: "cea2dcdf065132f91463dae4a3d549383ee242ddc7fb0b3fffb1bbca492f54fe08adb0e4385cf94bad37b0c94cb093ab53b59d114088e0a2ad402bbab0a9ced4"
};

let inMemoryAuth = null;

function getBlobs() {
  try {
    const { getStore } = require("@netlify/blobs");
    if (getStore) {
      return getStore({ name: "amoura-admin-auth", consistency: "strong" });
    }
  } catch (e) {}
  return null;
}

function hashPassword(password, salt) {
  if (!salt) {
    salt = crypto.randomBytes(16).toString("hex");
  }
  const hash = crypto.pbkdf2Sync(password, salt, 10000, 64, "sha512").toString("hex");
  return { hash, salt };
}

function verifyHash(password, storedHash, salt) {
  try {
    const { hash } = hashPassword(password, salt);
    const bufA = Buffer.from(hash, "hex");
    const bufB = Buffer.from(storedHash, "hex");
    if (bufA.length !== bufB.length) return false;
    return crypto.timingSafeEqual(bufA, bufB);
  } catch (e) {
    return false;
  }
}

function generateToken() {
  const payload = {
    role: "admin",
    iat: Date.now(),
    exp: Date.now() + 7 * 24 * 60 * 60 * 1000 // 7 days validity
  };
  const body = Buffer.from(JSON.stringify(payload)).toString("base64url");
  const sig = crypto.createHmac("sha256", SERVER_SECRET).update(body).digest("base64url");
  return `${body}.${sig}`;
}

function verifyToken(token) {
  if (!token || typeof token !== "string" || !token.includes(".")) return false;
  try {
    const [body, sig] = token.split(".");
    const expectedSig = crypto.createHmac("sha256", SERVER_SECRET).update(body).digest("base64url");
    if (sig !== expectedSig) return false;
    const payload = JSON.parse(Buffer.from(body, "base64url").toString("utf-8"));
    if (payload.exp && Date.now() > payload.exp) return false;
    return payload.role === "admin";
  } catch (e) {
    return false;
  }
}

async function getStoredCredentials() {
  if (inMemoryAuth) return inMemoryAuth;

  // 1. Try Google Sheets Cloud Database
  try {
    const res = await fetch(GOOGLE_SHEET_API + "?type=auth&t=" + Date.now());
    if (res.ok) {
      const data = await res.json();
      if (data && data.salt && data.hash) {
        inMemoryAuth = { salt: data.salt, hash: data.hash };
        return inMemoryAuth;
      }
    }
  } catch (e) {}

  // 2. Try Netlify Blobs
  const blobs = getBlobs();
  if (blobs) {
    try {
      const stored = await blobs.get("admin_credentials", { type: "json" });
      if (stored && stored.salt && stored.hash) {
        inMemoryAuth = stored;
        return inMemoryAuth;
      }
    } catch (e) {}
  }

  // 3. Fallback to default credentials
  return DEFAULT_AUTH;
}

async function saveStoredCredentials(authObj) {
  inMemoryAuth = authObj;

  // 1. Save to Netlify Blobs
  const blobs = getBlobs();
  if (blobs) {
    try {
      await blobs.setJSON("admin_credentials", authObj);
    } catch (e) {}
  }

  // 2. Save to Google Sheets
  try {
    await fetch(GOOGLE_SHEET_API, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        action: "updateAdminAuth",
        salt: authObj.salt,
        hash: authObj.hash,
        updatedAt: new Date().toISOString()
      })
    });
  } catch (e) {}
}

exports.handler = async (event, context) => {
  const headers = {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Headers": "Content-Type, Authorization",
    "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
    "Content-Type": "application/json"
  };

  if (event.httpMethod === "OPTIONS") {
    return { statusCode: 200, headers, body: "" };
  }

  if (event.httpMethod === "POST") {
    try {
      const data = JSON.parse(event.body || "{}");
      const action = data.action || "login";

      // ACTION 1: LOGIN
      if (action === "login") {
        const password = String(data.password || "");
        if (!password) {
          return {
            statusCode: 400,
            headers,
            body: JSON.stringify({ success: false, error: "Password is required." })
          };
        }

        const creds = await getStoredCredentials();
        const isValid = verifyHash(password, creds.hash, creds.salt);

        if (!isValid) {
          return {
            statusCode: 401,
            headers,
            body: JSON.stringify({ success: false, error: "Incorrect password. Please try again." })
          };
        }

        const token = generateToken();
        return {
          statusCode: 200,
          headers,
          body: JSON.stringify({
            success: true,
            token,
            message: "Login successful!"
          })
        };
      }

      // ACTION 2: VERIFY TOKEN
      if (action === "verify") {
        const token = data.token;
        const valid = verifyToken(token);
        return {
          statusCode: 200,
          headers,
          body: JSON.stringify({ success: valid })
        };
      }

      // ACTION 3: CHANGE PASSWORD
      if (action === "changePassword") {
        const token = data.token;
        if (!verifyToken(token)) {
          return {
            statusCode: 401,
            headers,
            body: JSON.stringify({ success: false, error: "Unauthorized session. Please login again." })
          };
        }

        const currentPassword = String(data.currentPassword || "");
        const newPassword = String(data.newPassword || "");

        if (!currentPassword || !newPassword) {
          return {
            statusCode: 400,
            headers,
            body: JSON.stringify({ success: false, error: "Current password and new password are required." })
          };
        }

        if (newPassword.length < 6) {
          return {
            statusCode: 400,
            headers,
            body: JSON.stringify({ success: false, error: "New password must be at least 6 characters long." })
          };
        }

        // Verify current password first
        const creds = await getStoredCredentials();
        const isCurrentValid = verifyHash(currentPassword, creds.hash, creds.salt);

        if (!isCurrentValid) {
          return {
            statusCode: 400,
            headers,
            body: JSON.stringify({ success: false, error: "Current password is incorrect." })
          };
        }

        // Hash new password with fresh cryptographic salt
        const { hash, salt } = hashPassword(newPassword);
        await saveStoredCredentials({ salt, hash, updatedAt: new Date().toISOString() });

        const newToken = generateToken();
        return {
          statusCode: 200,
          headers,
          body: JSON.stringify({
            success: true,
            token: newToken,
            message: "Password changed successfully! Next time use your new password."
          })
        };
      }

      return {
        statusCode: 400,
        headers,
        body: JSON.stringify({ success: false, error: "Unknown action." })
      };

    } catch (err) {
      return {
        statusCode: 500,
        headers,
        body: JSON.stringify({ success: false, error: err.message || "Server error" })
      };
    }
  }

  return { statusCode: 200, headers, body: JSON.stringify({ status: "ok" }) };
};
