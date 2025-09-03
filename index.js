const express = require("express");
const axios = require("axios");
const bodyParser = require("body-parser");
const cors = require("cors");

const app = express();

// Increase body size limit
app.use(bodyParser.json({ limit: "10mb" }));
app.use(bodyParser.urlencoded({ limit: "10mb", extended: true }));
app.use(cors());

// Helper function to split into batches
function chunkArray(array, size) {
  const result = [];
  for (let i = 0; i < array.length; i += size) {
    result.push(array.slice(i, i + size));
  }
  return result;
}

app.post("/send-sms", async (req, res) => {
  const { api_key, sender_id, message, recipient } = req.body;

  if (!api_key || !sender_id || !message || !recipient || recipient.length === 0) {
    return res.status(400).json({ error: "Missing required parameters" });
  }

  try {
    const batches = chunkArray(recipient, 350);
    const results = [];

    for (const batch of batches) {
      const response = await axios.post(
        "https://uellosend.com/campaign/",
        { api_key, sender_id, message, recipient: batch },
        { headers: { "Content-Type": "application/json" } }
      );
      results.push(response.data);
    }

    res.status(200).json({
      status: "Success",
      totalBatches: batches.length,
      responses: results,
    });
  } catch (error) {
    res.status(500).json({
      error: error.message,
      details: error.response?.data || null,
    });
  }
});

app.post("/check-balance", async (req, res) => {
  const { api_key } = req.body;
  if (!api_key) return res.status(400).json({ error: "API key is required" });

  try {
    const balanceResponse = await axios.post(
      "https://uellosend.com/balance/",
      { api_key },
      { headers: { "Content-Type": "application/json" } }
    );
    res.status(200).json(balanceResponse.data);
  } catch (error) {
    res.status(500).json({
      error: error.message,
      details: error.response?.data || null,
    });
  }
});

const PORT = 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
