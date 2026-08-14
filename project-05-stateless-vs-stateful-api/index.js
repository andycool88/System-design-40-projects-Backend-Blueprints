// Import Express framework
const express = require("express");
// Import session middleware
const session = require("express-session");

// Create an Express app
const app = express();

// Allow parsing of JSON request bodies
app.use(express.json());

// Stateless example: token-based authentication
app.get("/stateless", (req, res) => {
  // Read token from Authorization header
  const token = req.headers["authorization"];
  // Check if token matches expected value
  if (token === "Bearer secret123") {
    // If valid, return success
    res.json({ message: "Stateless auth success" });
  } else {
    // If invalid, return 401 Unauthorized
    res.status(401).json({ error: "Invalid token" });
  }
});

// Configure session middleware for stateful example
app.use(session({ secret: "keyboard cat", resave: false, saveUninitialized: true }));

// Login route to create a session
app.post("/login", (req, res) => {
  // Save user info in session
  req.session.user = "Andrew";
  // Return success message
  res.json({ message: "Logged in with session" });
});

// Stateful route that checks session
app.get("/stateful", (req, res) => {
  // If user exists in session, return greeting
  if (req.session.user) {
    res.json({ message: `Hello ${req.session.user}` });
  } else {
    // If no session, return 401 Unauthorized
    res.status(401).json({ error: "Not logged in" });
  }
});

// Start the server on port 7000
app.listen(7000, () => console.log("State API running on port 7000"));
