// Import Express framework
const express = require("express");

// Create an Express app
const app = express();

// Mock user data
const users = [{ id: 1, name: "Andrew", email: "andrew@example.com" }];

// Define a REST endpoint to fetch user by ID
app.get("/users/:id", (req, res) => {
  // Find the user by ID
  const user = users.find(u => u.id == req.params.id);
  // Return the user object as JSON
  res.json(user);
});

// Start the REST server
app.listen(4000, () => console.log("REST API running on port 4000"));
