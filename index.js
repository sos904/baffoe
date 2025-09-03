const express = require("express");
const axios = require("axios");
const bodyParser = require("body-parser");
const cors = require("cors");

const app = express();
app.use(bodyParser.json({ limit: "50mb" }));
app.use(cors());

// Helper function to split array into chunks
function chunkArray(array, size) {
  const result = [];
  for (let i = 0; i < array.length; i += size) {
    result.push(array.slice(i, i + size));
  }
  return result;
}

app.post("/send-sms", async (req, res) => {
  const { api_key, sender_id, message, recipient } = req.body;

  if (!Array.isArray(recipient) || recipient.length === 0) {
    return res.status(400).json({ error: "Recipient list is empty or invalid" });
  }

  try {
    const batchSize = 500; // Adjust batch size if needed
    const batches = chunkArray(recipient, batchSize);
    const results = [];

    for (const batch of batches) {
      const response = await axios.post(
        "https://uellosend.com/campaign/",
        { api_key, sender_id, message, recipient: batch },
        { headers: { "Content-Type": "application/json" } }
      );
      results.push(response.data);
      console.log(`Batch of ${batch.length} sent`);
    }

    res.status(200).json({ status: "All batches sent", results });
  } catch (error) {
    console.error("Error sending SMS:", error.response?.data || error.message);
    res.status(500).json({
      error: error.message,
      details: error.response?.data || null,
    });
  }
});

const PORT = 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
