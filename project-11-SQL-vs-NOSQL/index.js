// Import Express framework
const express = require("express");
// Import PostgreSQL client
const { Pool } = require("pg");

// Create an Express app
const app = express();
// Allow parsing of JSON request bodies
app.use(express.json());

// Configure PostgreSQL connection
const pool = new Pool({
  user: "postgres",       // your DB username
  host: "localhost",      // DB host
  database: "testdb",     // DB name
  password: "password",   // your DB password
  port: 5432              // default Postgres port
});

// Route to create a new customer (SQL style)
app.post("/customers", async (req, res) => {
  // Extract customer data from request body
  const { name, email } = req.body;
  // Insert into SQL table
  const result = await pool.query("INSERT INTO customers (name, email) VALUES ($1, $2) RETURNING *", [name, email]);
  // Return the inserted row
  res.json(result.rows[0]);
});

// Route to fetch all customers
app.get("/customers", async (req, res) => {
  // Query all rows from customers table
  const result = await pool.query("SELECT * FROM customers");
  res.json(result.rows);
});

// Start the server
app.listen(10000, () => console.log("SQL API running on port 10000"));
