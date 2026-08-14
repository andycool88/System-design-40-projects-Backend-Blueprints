// Import Express framework
const express = require("express");
// Import rate limiter middleware
const rateLimit = require("express-rate-limit");

// Create an Express app
const app = express();

// -------------------- RATE LIMITING --------------------
// Limit: max 5 requests per minute
const limiter = rateLimit({
  windowMs: 60 * 1000, // 1 minute
  max: 5,
  message: { error: "Too many requests, try again later" }
});

// Apply rate limiter to this route
app.get("/rate-limited", limiter, (req, res) => {
  res.json({ message: "You passed the rate limit check" });
});

// -------------------- THROTTLING --------------------
// Simple throttle: delay response by 2 seconds
app.get("/throttled", (req, res) => {
  setTimeout(() => {
    res.json({ message: "Response delayed to throttle traffic" });
  }, 2000);
});

// Start the server
app.listen(9200, () => console.log("Rate/Throttle API running on port 9200"));
