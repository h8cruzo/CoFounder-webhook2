const express = require("express");
const fetch = require("node-fetch"); // v2 (CommonJS)
const app = express();

// Set this in Railway → Project → Variables
const LOVABLE_WEBHOOK_URL = process.env.LOVABLE_WEBHOOK_URL;

app.use(express.json());

// Health check
app.get("/", (_req, res) => res.status(200).send("ok"));

// POST endpoint Make.com will call
app.post("/webhook", async (req, res) => {
  try {
    if (!LOVABLE_WEBHOOK_URL) {
      return res
        .status(500)
        .json({ error: "LOVABLE_WEBHOOK_URL env var is not set" });
    }

    const { message } = req.body || {};
    if (typeof message !== "string" || !message.trim()) {
      return res.status(400).json({ error: 'Body must include "message" string' });
    }

    // Forward to Lovable’s webhook
    const forward = await fetch(LOVABLE_WEBHOOK_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ message })
    });

    // Try to parse Lovable response safely
    const ct = forward.headers.get("content-type") || "";
    let data;
    if (ct.includes("application/json")) {
      data = await forward.json();
    } else {
      const text = await forward.text();
      try { data = JSON.parse(text); } catch { data = { message: text }; }
    }

    // Normalize what we return to Make.com
    const aiMsg =
      (data && (data.message || data.reply || data.text)) ||
      (typeof data === "string" ? data : "");

    return res.status(200).json({ message: aiMsg });
  } catch (err) {
    console.error("Proxy error:", err);
    return res.status(502).json({ error: "Proxy error", detail: String(err?.message || err) });
  }
});

const PORT = process.env.PORT || 8080;
app.listen(PORT, () => console.log(`webhook2 listening on ${PORT}`));

