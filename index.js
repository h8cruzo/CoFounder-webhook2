const express = require('express');
const fetch = require('node-fetch');
const app = express();

app.use(express.urlencoded({ extended: false }));
app.use(express.json());

// When Lovable sends a response here
app.post('/webhook', async (req, res) => {
  console.log('Received response from Lovable:', req.body);

  try {
    // Forward to Make's Webhook
    await fetch('https://hook.us2.make.com/50o6wnkj8a3gikoqsr42odvsa5o4ntu4', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(req.body),
    });

    res.status(200).send('Forwarded to Make!');
  } catch (err) {
    console.error('Error:', err);
    res.status(500).send('Something went wrong');
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
