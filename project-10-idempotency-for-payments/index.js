// Import Express framework
const express = require("express");

// Create an Express app
const app = express();

// Allow parsing of JSON request bodies
app.use(express.json());

// In-memory store for processed requests
const processedRequests = {};

// Payment simulation route
app.post("/pay", (req, res) => {
  // Extract idempotency key from headers
  const key = req.headers["idempotency-key"];

  // If request with same key already processed
  if (processedRequests[key]) {
    // Return the same result again (no duplicate charge)
    return res.json({ message: "Payment already processed", result: processedRequests[key] });
  }

  // Otherwise, simulate payment processing
  const result = { status: "success", transactionId: Date.now() };

  // Save result under idempotency key
  processedRequests[key] = result;

  // Return success response
  res.json({ message: "Payment processed", result });
});

// Start the server
app.listen(9300, () => console.log("Idempotency API running on port 9300"));
