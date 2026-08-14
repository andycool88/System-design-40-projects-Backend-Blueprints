// Import the Express framework
const express = require("express");

// Create an Express application
const app = express();

// Allow parsing of JSON request bodies
app.use(express.json());

// Route that simulates a successful request
app.get("/success", (req, res) => {
  // Return 200 OK with a message
  res.status(200).json({ message: "OK" });
});

// Route that simulates resource creation
app.post("/create", (req, res) => {
  // Check if "name" field is provided
  if (!req.body.name) {
    // If missing, return 400 Bad Request
    return res.status(400).json({ error: "Bad Request: name required" });
  }
  // If valid, return 201 Created
  res.status(201).json({ message: "Resource created" });
});

// Route that simulates unauthorized access
app.get("/unauthorized", (req, res) => {
  // Return 401 Unauthorized
  res.status(401).json({ error: "Unauthorized" });
});

// Route that simulates server error
app.get("/server-error", (req, res) => {
  // Return 500 Internal Server Error
  res.status(500).json({ error: "Internal Server Error" });
});

// Start the server on port 6000
app.listen(6000, () => console.log("Status API running on port 6000"));
