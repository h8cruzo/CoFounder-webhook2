const express = require('express');
const axios = require('axios');
const bodyParser = require('body-parser');

const app = express();
app.use(bodyParser.json());

const MAKE_WEBHOOK_URL = 'https://hook.us2.make.com/your_make_webhook_here'; // replace with actual Make webhook

app.post('/', async (req, res) => {
  const incomingMessage = req.body.message;

  try {
    const lovableResponse = await axios.post('https://info-reply-bot.lovable.app/webhook', {
      message: incomingMessage
    });

    const aiReply = lovableResponse.data.message;

    // Forward Lovable's reply to Make.com webhook
    await axios.post(MAKE_WEBHOOK_URL, {
      message: aiReply
    });

    res.status(200).json({ success: true });
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ success: false, error: err.message });
  }
});

const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Webhook2 listening on port ${port}`);
});

