const express = require('express');
const fetch = require('node-fetch');

const app = express();
app.use(express.json());

// health
app.get('/', (_req, res) => res.send('ok'));

// helpful GET response so it doesn't look like an error if you visit /webhook
app.get('/webhook', (_req, res) => res.status(405).send('Use POST /webhook'));

app.post('/webhook', async (req, res) => {
  try {
    const { message } = req.body || {};
    if (!message) return res.status(400).json({ success:false, error:'Missing "message"' });

    // Send to Lovable’s webhook URL
    const lovable = await fetch('https://info-reply-bot.lovable.app/webhook', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ message })
    });

    // Expect Lovable returns JSON: { success, message, ... }
    const data = await lovable.json();

    // Normalize what we return to Make
    return res.json({
      success: true,
      message: data.message || '',
      raw: data
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success:false, error: String(err) });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log('webhook2 listening on', PORT));
const express = require('express');
const fetch = require('node-fetch');

const app = express();
app.use(express.json());

// health
app.get('/', (_req, res) => res.send('ok'));

// helpful GET response so it doesn't look like an error if you visit /webhook
app.get('/webhook', (_req, res) => res.status(405).send('Use POST /webhook'));

app.post('/webhook', async (req, res) => {
  try {
    const { message } = req.body || {};
    if (!message) return res.status(400).json({ success:false, error:'Missing "message"' });

    // Send to Lovable’s webhook URL
    const lovable = await fetch('https://info-reply-bot.lovable.app/webhook', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ message })
    });

    // Expect Lovable returns JSON: { success, message, ... }
    const data = await lovable.json();

    // Normalize what we return to Make
    return res.json({
      success: true,
      message: data.message || '',
      raw: data
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success:false, error: String(err) });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log('webhook2 listening on', PORT));
