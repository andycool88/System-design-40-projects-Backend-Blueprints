// Import Express framework
const express = require("express");
// Import session middleware
const session = require("express-session");
// Import JWT library
const jwt = require("jsonwebtoken");

// Create an Express app
const app = express();

// Allow parsing of JSON request bodies
app.use(express.json());

// Configure session middleware for session-based auth
app.use(session({ secret: "keyboard cat", resave: false, saveUninitialized: true }));

// -------------------- SESSION-BASED AUTH --------------------

// Login route using sessions
app.post("/session-login", (req, res) => {
  // Save user info in session
  req.session.user = { id: 1, name: "Andrew" };
  // Return success message
  res.json({ message: "Logged in with session" });
});

// Protected route using sessions
app.get("/session-protected", (req, res) => {
  // Check if user exists in session
  if (req.session.user) {
    res.json({ message: `Hello ${req.session.user.name}` });
  } else {
    res.status(401).json({ error: "Not logged in" });
  }
});

// -------------------- JWT-BASED AUTH --------------------

// Secret key for signing JWTs
const SECRET_KEY = "mysecretkey";

// Login route using JWT
app.post("/jwt-login", (req, res) => {
  // Create a token with user info
  const token = jwt.sign({ id: 1, name: "Andrew" }, SECRET_KEY, { expiresIn: "1h" });
  // Return the token
  res.json({ token });
});

// Protected route using JWT
app.get("/jwt-protected", (req, res) => {
  // Read token from Authorization header
  const token = req.headers["authorization"]?.split(" ")[1];
  if (!token) return res.status(401).json({ error: "Token required" });

  try {
    // Verify token
    const decoded = jwt.verify(token, SECRET_KEY);
    res.json({ message: `Hello ${decoded.name}` });
  } catch (err) {
    res.status(401).json({ error: "Invalid token" });
  }
});

// Start the server
app.listen(9000, () => console.log("Auth API running on port 9000"));
