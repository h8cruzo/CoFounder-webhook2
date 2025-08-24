const express = require('express');
const fetch = require('node-fetch'); // v2, CommonJS
const app = express();

app.use(express.json());

// quick health check
app.get('/', (_req, res) => res.send('ok'));

// proxy -> Lovable -> return clean JSON
app.post('/webhook', async (req, res) => {
  try {
    // support both {message:"..."} and Twilio's Body field if you ever send it directly
    const userMessage =
      req.body?.message ?? req.body?.Body ?? req.body?.body ?? '';

    // 👉 Lovable preview webhook URL (from the Webhook API tab)
    const lovableResp = await fetch('https://info-reply-bot.lovable.app/webhook', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ message: userMessage })
    });

    // try JSON first; if Lovable ever returns HTML, keep it in raw
    let parsed;
    try {
      parsed = await lovableResp.json();
    } catch (_) {
      parsed = { raw: await lovableResp.text() };
    }

    const aiMessage =
      parsed?.message ?? parsed?.reply ?? parsed?.text ?? '';

    return res.json({
      success: true,
      message: aiMessage,
      raw: parsed,                 // handy for debugging in Railway logs
      timestamp: new Date().toISOString()
    });
  } catch (err) {
    console.error('webhook2 error:', err);
    return res.status(500).json({ success: false, error: String(err) });
  }
});

const PORT = process.env.PORT || 8080; // Railway defaults to 8080
app.listen(PORT, () => console.log(`webhook2 listening on ${PORT}`));
