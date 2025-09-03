const express = require("express");
const axios = require("axios");
const bodyParser = require("body-parser");
const cors = require("cors");

const app = express();

// Middleware with increased body size limit
app.use(bodyParser.json({ limit: "50mb" })); // allow up to 50 MB
app.use(cors());

// Route to handle SMS sending
app.post("/send-sms", async (req, res) => {
  const { api_key, sender_id, message, recipient } = req.body;

  try {
    const response = await axios.post(
      "https://uellosend.com/campaign/",
      { api_key, sender_id, message, recipient },
      { headers: { "Content-Type": "application/json" } }
    );

    res.status(200).json(response.data);
  } catch (error) {
    res.status(500).json({
      error: error.message,
      details: error.response?.data || null,
    });
  }
});

// Check balance route
app.post("/check-balance", async (req, res) => {
  const { api_key } = req.body;

  if (!api_key) {
    return res.status(400).json({ error: "API key is required" });
  }

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

// Start the server
const PORT = 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
