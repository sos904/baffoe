const express = require("express");
const axios = require("axios");
const bodyParser = require("body-parser");

const app = express();
const PORT = 3000;

app.use(bodyParser.json());

app.post("/send-sms", async (req, res) => {
  try {
    const { api_key, sender_id, message, recipient } = req.body;

    const response = await axios.post(
      "https://uellosend.com/quicksend/",
      {
        api_key,
        sender_id,
        message,
        recipient,
      },
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    res.status(200).json(response.data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.listen(PORT, () =>
  console.log(`Proxy server running on http://localhost:${PORT}`)
);
