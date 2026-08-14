// Import Express framework
const express = require("express");

// Create an Express app
const app = express();

// Allow parsing of JSON request bodies
app.use(express.json());

// Mock user database
const users = [
  { id: 1, username: "andrew", password: "pass123", role: "admin" },
  { id: 2, username: "john", password: "pass456", role: "user" }
];

// Authentication route (login)
app.post("/login", (req, res) => {
  // Extract username and password from request body
  const { username, password } = req.body;
  // Find user in mock database
  const user = users.find(u => u.username === username && u.password === password);
  // If user not found, return 401 Unauthorized
  if (!user) return res.status(401).json({ error: "Invalid credentials" });
  // If found, return success message with role
  res.json({ message: "Login successful", role: user.role });
});

// Authorization route (admin-only access)
app.get("/admin", (req, res) => {
  // Read role from request header (simulated)
  const role = req.headers["role"];
  // If role is admin, allow access
  if (role === "admin") {
    res.json({ message: "Welcome Admin" });
  } else {
    // Otherwise, return 403 Forbidden
    res.status(403).json({ error: "Forbidden: Admins only" });
  }
});

// Start the server on port 8000
app.listen(8000, () => console.log("Auth API running on port 8000"));
