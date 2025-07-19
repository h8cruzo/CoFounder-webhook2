const express = require('express');
const fetch = require('node-fetch');
const app = express();

app.use(express.urlencoded({ extended: false }));
app.use(express.json());

app.post('/webhook', async (req, res) => {
  console.log('Received webhook from Lovable:', req.body);
  
  try {
    const response = await fetch('https://webhook.site/2781be55-118f-4362-99b8-7a6d97ae50cb', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(req.body),
    });

    const data = await response.text();
    console.log('Response from Webhook.site:', data);
    res.status(200).send('Forwarded to Webhook.site!');
  } catch (err) {
    console.error('Error:', err);
    res.status(500).send('Something went wrong');
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

