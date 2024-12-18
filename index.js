const express = require("express");
const axios = require("axios");
const bodyParser = require("body-parser");
const cors = require("cors");

const app = express();
const PORT = process.env.PORT || 3000; // Dynamic port for production environments

// Middleware
app.use(bodyParser.json());
app.use(cors());

// Route for sending SMS
app.post("/send-sms", async (req, res) => {
  try {
    const { api_key, sender_id, message, recipient } = req.body;

    // Check for missing parameters
    if (!api_key || !sender_id || !message || !recipient) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    // Send request to the SMS API
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
    // Handle Axios errors specifically
    if (error.response) {
      // API responded with an error
      res.status(error.response.status).json({ error: error.response.data });
    } else if (error.request) {
      // No response received from the API
      res.status(500).json({ error: "No response from SMS API" });
    } else {
      // Something else went wrong
      res.status(500).json({ error: error.message });
    }
  }
});

// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Proxy server running on port ${PORT}`));
