const express = require("express");
const axios = require("axios");
const bodyParser = require("body-parser");
const cors = require("cors");

const app = express();

// Middleware
app.use(bodyParser.json());
app.use(cors());

// Route to handle SMS sending
app.post("/send-sms", async (req, res) => {
  
  const { api_key, sender_id, message, recipient } = req.body;

  try {
    // Forward the request to UelloSend
    const response = await axios.post(
      "https://uellosend.com/campaign/",
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

    // Return UelloSend response to the client
    res.status(200).json(response.data);
  } catch (error) {
    // Handle errors gracefully
    res.status(500).json({
      error: error.message,
      details: error.response?.data || null,
    });
  }
});

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

    res.status(200).json(balanceResponse.data); // Send the balance data back
  } catch (error) {
    res.status(500).json({
      error: error.message,
      details: error.response?.data || null,
    });
  }
});

// Start the server
const PORT = 3000; // Render uses dynamic port assignment
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
