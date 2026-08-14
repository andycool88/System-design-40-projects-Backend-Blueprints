# Project 11 — PostgreSQL SQL API with Node.js

A practical Express.js project demonstrating how to build a backend API that connects directly to a **PostgreSQL database** using the native `pg` client.

This project introduces the fundamentals of working with a relational SQL database from Node.js, including PostgreSQL connections, connection pools, SQL queries, parameterized queries, inserting records, and retrieving records.

This is the eleventh blueprint in the **Backend System Design — 40 Project Blueprints** series.

---

# 🎯 What This Project Teaches

This project focuses on the fundamentals of building a PostgreSQL-backed API:

* PostgreSQL
* SQL
* Node.js database connections
* Express.js
* `pg` PostgreSQL client
* Connection pooling
* SQL `INSERT`
* SQL `SELECT`
* Parameterized queries
* SQL placeholders
* Request bodies
* Relational databases
* CRUD fundamentals
* Database-backed APIs

The key goal is to understand:

> **How a Node.js backend communicates directly with a PostgreSQL database using SQL queries.**

---

# 🗄️ What Is PostgreSQL?

PostgreSQL is an open-source relational database management system.

Unlike a document database such as MongoDB, PostgreSQL stores information in **tables made up of rows and columns**.

For example:

```text
customers

┌────┬──────────────┬─────────────────────┐
│ id │ name         │ email               │
├────┼──────────────┼─────────────────────┤
│ 1  │ Andrew       │ andrew@example.com  │
│ 2  │ John         │ john@example.com    │
└────┴──────────────┴─────────────────────┘
```

The application communicates with PostgreSQL using SQL.

---

# 🏗️ Architecture

```text
                         Client
                           │
                           ▼
                    Express.js API
                           │
                           ▼
                    PostgreSQL Pool
                           │
                           ▼
                      PostgreSQL
                           │
                           ▼
                      customers
                         Table
```

The request flow is:

```text
Client
  ↓
HTTP Request
  ↓
Express Route
  ↓
PostgreSQL Connection Pool
  ↓
SQL Query
  ↓
PostgreSQL
  ↓
Query Result
  ↓
Express Response
  ↓
Client
```

---

# 📡 API Endpoints

| Method | Endpoint     | Purpose                |
| ------ | ------------ | ---------------------- |
| `POST` | `/customers` | Create a new customer  |
| `GET`  | `/customers` | Retrieve all customers |

---

# 1. Importing Express

The application begins by importing Express:

```javascript
const express = require("express");
```

Express is responsible for:

* Creating the HTTP server
* Defining routes
* Handling requests
* Sending responses
* Managing middleware

The application is then created:

```javascript
const app = express();
```

---

# 2. Importing PostgreSQL

The project imports the PostgreSQL `Pool`:

```javascript
const { Pool } = require("pg");
```

The `pg` package is the PostgreSQL client for Node.js.

It allows the application to communicate with PostgreSQL.

Conceptually:

```text
Node.js
   │
   ▼
   pg
   │
   ▼
PostgreSQL
```

---

# 🔌 3. PostgreSQL Connection Pool

The project creates a PostgreSQL connection pool:

```javascript
const pool = new Pool({
  user: "postgres",
  host: "localhost",
  database: "testdb",
  password: "password",
  port: 5432
});
```

The pool manages database connections that can be reused by incoming requests.

---

# 🧠 Why Use a Connection Pool?

Imagine an API receiving many requests:

```text
Request 1 ──┐
Request 2 ──┤
Request 3 ──┤──→ PostgreSQL
Request 4 ──┤
Request 5 ──┘
```

Creating a completely new database connection for every request can be inefficient.

A connection pool maintains reusable connections:

```text
                 Connection Pool
              ┌──────────────────┐
Request ─────→│ Connection 1     │
Request ─────→│ Connection 2     │
Request ─────→│ Connection 3     │
Request ─────→│ Connection 4     │
              └────────┬─────────┘
                       │
                       ▼
                   PostgreSQL
```

This is an important pattern for database-backed applications.

---

# 🔑 PostgreSQL Configuration

The project uses:

```javascript
user: "postgres"
```

This is the PostgreSQL database user.

---

### Host

```javascript
host: "localhost"
```

This means PostgreSQL is running on the same machine as the Node.js application.

---

### Database

```javascript
database: "testdb"
```

The application connects to a database named:

```text
testdb
```

---

### Password

```javascript
password: "password"
```

This is the PostgreSQL user's password.

**Do not hardcode real database credentials in production.**

Use environment variables instead.

---

### Port

```javascript
port: 5432
```

`5432` is the standard PostgreSQL port.

---

# 📥 4. Parsing JSON Requests

The project uses:

```javascript
app.use(express.json());
```

This allows Express to parse JSON request bodies.

For example:

```json
{
  "name": "Andrew",
  "email": "andrew@example.com"
}
```

Without the JSON middleware, Express would not automatically make this data available through:

```javascript
req.body
```

---

# 👤 5. Creating a Customer

The project provides:

```http
POST /customers
```

The route is:

```javascript
app.post("/customers", async (req, res) => {
```

The route is asynchronous because it communicates with PostgreSQL.

---

# 📦 Extracting Request Data

The request body contains:

```javascript
const { name, email } = req.body;
```

For example:

```json
{
  "name": "Andrew",
  "email": "andrew@example.com"
}
```

The values become:

```text
name  → Andrew
email → andrew@example.com
```

---

# 📝 6. SQL INSERT

The application executes:

```javascript
const result = await pool.query(
  "INSERT INTO customers (name, email) VALUES ($1, $2) RETURNING *",
  [name, email]
);
```

This SQL statement inserts a new customer.

Conceptually:

```text
Request Body
     │
     ├── name
     └── email
          │
          ▼
       SQL INSERT
          │
          ▼
      PostgreSQL
          │
          ▼
     New Customer
```

---

# 🔢 Understanding `$1` and `$2`

The SQL query uses:

```sql
VALUES ($1, $2)
```

These are **parameter placeholders**.

The values are provided separately:

```javascript
[name, email]
```

Therefore:

```text
$1 → name
$2 → email
```

For example:

```text
$1 → "Andrew"
$2 → "andrew@example.com"
```

---

# 🛡️ Why Parameterized Queries Matter

Instead of constructing SQL using string concatenation:

```javascript
// Avoid this pattern
const query = `INSERT INTO customers VALUES ('${name}', '${email}')`;
```

the project uses:

```javascript
pool.query(
  "INSERT INTO customers (name, email) VALUES ($1, $2)",
  [name, email]
);
```

Parameterized queries help protect SQL statements from SQL injection and properly handle parameter values.

This is a fundamental database security practice.

---

# 🔄 Understanding `RETURNING *`

The SQL statement contains:

```sql
RETURNING *
```

This tells PostgreSQL to return the row that was inserted.

For example:

```text
INSERT
  ↓
Create customer
  ↓
RETURNING *
  ↓
Return inserted row
```

The returned row is available through:

```javascript
result.rows[0]
```

---

# 📤 Returning the Created Customer

The API sends:

```javascript
res.json(result.rows[0]);
```

For example:

```json
{
  "id": 1,
  "name": "Andrew",
  "email": "andrew@example.com"
}
```

The exact fields depend on the structure of your `customers` table.

---

# 🔎 7. Fetching Customers

The project also provides:

```http
GET /customers
```

The route is:

```javascript
app.get("/customers", async (req, res) => {
```

It executes:

```javascript
const result = await pool.query(
  "SELECT * FROM customers"
);
```

This retrieves all rows from the `customers` table.

---

# 📊 Understanding `SELECT`

The query:

```sql
SELECT * FROM customers;
```

means:

> Select all columns from all rows in the `customers` table.

For example:

```text
customers

┌────┬────────┬───────────────────┐
│ id │ name   │ email             │
├────┼────────┼───────────────────┤
│ 1  │ Andrew │ andrew@example.com│
│ 2  │ John   │ john@example.com  │
└────┴────────┴───────────────────┘
```

The result becomes an array:

```javascript
result.rows
```

---

# 📤 Returning All Customers

The API returns:

```javascript
res.json(result.rows);
```

Example:

```json
[
  {
    "id": 1,
    "name": "Andrew",
    "email": "andrew@example.com"
  },
  {
    "id": 2,
    "name": "John",
    "email": "john@example.com"
  }
]
```

---

# 🔄 Complete Database Flow

```text
                       Client
                          │
                          ▼
                    POST /customers
                          │
                          ▼
                    Express.js
                          │
                          ▼
                  req.body
                 /          \
              name         email
                 \          /
                  ▼        ▼
                   SQL Query
                       │
                       ▼
                PostgreSQL Pool
                       │
                       ▼
                  PostgreSQL
                       │
                       ▼
                 INSERT Row
                       │
                       ▼
                  RETURNING *
                       │
                       ▼
                   Express
                       │
                       ▼
                    JSON
                       │
                       ▼
                    Client
```

---

# 🧠 Key Concepts

## 1. Relational Database

PostgreSQL is relational.

Data is organized into:

```text
Database
   ↓
Tables
   ↓
Rows
   ↓
Columns
```

For example:

```text
Database
   │
   └── customers
          │
          ├── id
          ├── name
          └── email
```

---

# 2. SQL

SQL stands for:

**Structured Query Language**

It is used to communicate with relational databases.

This project uses:

```sql
INSERT
SELECT
```

These are two fundamental SQL operations.

---

# 3. Connection Pool

The `Pool` manages reusable database connections.

```javascript
const pool = new Pool({...});
```

The application then uses:

```javascript
pool.query(...)
```

to execute SQL.

---

# 4. CRUD

CRUD represents the four fundamental database operations:

```text
C → Create
R → Read
U → Update
D → Delete
```

This project currently demonstrates:

```text
CREATE → POST /customers
READ   → GET /customers
```

The remaining operations would be:

```text
UPDATE → PUT/PATCH /customers/:id
DELETE → DELETE /customers/:id
```

---

# 📊 CRUD Mapping

| Operation | SQL      | HTTP        |
| --------- | -------- | ----------- |
| Create    | `INSERT` | `POST`      |
| Read      | `SELECT` | `GET`       |
| Update    | `UPDATE` | `PUT/PATCH` |
| Delete    | `DELETE` | `DELETE`    |

This project covers the first two.

---

# 🔐 Database Security

The current code contains:

```javascript
password: "password"
```

and:

```javascript
user: "postgres"
```

This is acceptable for a simple local learning project, but credentials should not be hardcoded in production.

A production application should use environment variables.

For example:

```text
DB_USER=postgres
DB_HOST=localhost
DB_NAME=testdb
DB_PASSWORD=your_password
DB_PORT=5432
```

Then the application can load them from the environment.

---

# 🚨 Error Handling

The current implementation does not include explicit error handling around the database operations.

For example:

```javascript
const result = await pool.query(...);
```

If PostgreSQL is unavailable or the SQL query fails, the request can result in an unhandled error.

A production implementation should use proper error handling.

Conceptually:

```text
Request
   ↓
Database Query
   │
   ├── Success → Response
   │
   └── Error → Error Handler
```

This becomes especially important when building production APIs.

---

# 🗄️ Database Setup

Before running the application, PostgreSQL needs to be installed and running.

You need a database named:

```text
testdb
```

and a table named:

```text
customers
```

A simple table could be created with:

```sql
CREATE TABLE customers (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL
);
```

This produces a basic structure:

```text
customers

┌────┬──────────────┬─────────────────────┐
│ id │ name         │ email               │
├────┼──────────────┼─────────────────────┤
│    │              │                     │
└────┴──────────────┴─────────────────────┘
```

---

# 📦 Technologies

* **Node.js**
* **Express.js**
* **PostgreSQL**
* **pg**
* **JavaScript**
* **SQL**
* **REST API**
* **Connection Pooling**

---

# 🚀 Getting Started

## Prerequisites

Make sure Node.js is installed:

```bash
node -v
npm -v
```

You also need PostgreSQL:

```bash
psql --version
```

Make sure the PostgreSQL server is running.

---

# 1. Create the Database

Open PostgreSQL:

```bash
psql -U postgres
```

Create the database:

```sql
CREATE DATABASE testdb;
```

Connect to it:

```sql
\c testdb
```

---

# 2. Create the Customers Table

Run:

```sql
CREATE TABLE customers (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL
);
```

Verify the table:

```sql
\dt
```

You should see:

```text
customers
```

---

# 3. Install Dependencies

From the project directory:

```bash
npm install
```

Or explicitly:

```bash
npm install express pg
```

---

# 4. Configure PostgreSQL

Update the connection configuration:

```javascript
const pool = new Pool({
  user: "postgres",
  host: "localhost",
  database: "testdb",
  password: "password",
  port: 5432
});
```

Replace the values with your local PostgreSQL credentials.

For production, use environment variables rather than hardcoding credentials.

---

# 5. Start the Server

```bash
node index.js
```

The server runs on:

```text
http://localhost:10000
```

You should see:

```text
SQL API running on port 10000
```

---

# 🧪 Testing

You can test the API using:

* Postman
* cURL
* Thunder Client
* Insomnia
* VS Code REST Client

---

# Test Creating a Customer

Send:

```bash
curl -X POST http://localhost:10000/customers \
-H "Content-Type: application/json" \
-d '{"name":"Andrew","email":"andrew@example.com"}'
```

Expected response:

```json
{
  "id": 1,
  "name": "Andrew",
  "email": "andrew@example.com"
}
```

The ID may be different depending on your database.

---

# Test Fetching Customers

Send:

```bash
curl http://localhost:10000/customers
```

Expected response:

```json
[
  {
    "id": 1,
    "name": "Andrew",
    "email": "andrew@example.com"
  }
]
```

If multiple customers exist, they will all be returned.

---

# 🔬 Testing the SQL Flow

The complete interaction looks like:

```text
POST /customers
       │
       ▼
{
  name,
  email
}
       │
       ▼
Express
       │
       ▼
pool.query()
       │
       ▼
INSERT INTO customers
       │
       ▼
PostgreSQL
       │
       ▼
RETURNING *
       │
       ▼
JSON Response
```

For reading:

```text
GET /customers
       │
       ▼
Express
       │
       ▼
pool.query()
       │
       ▼
SELECT * FROM customers
       │
       ▼
PostgreSQL
       │
       ▼
result.rows
       │
       ▼
JSON Response
```

---

# 📁 Project Structure

```text
project-11/
│
├── index.js
├── package.json
└── README.md
```

### `index.js`

Contains the Express application, PostgreSQL connection pool, customer creation route, customer retrieval route, and server configuration.

### `package.json`

Contains the Node.js project configuration and dependencies.

### `README.md`

Contains the documentation for the project and the PostgreSQL/SQL concepts demonstrated.

---

# 💡 Possible Improvements

This project intentionally keeps the database API simple so the fundamentals of PostgreSQL and SQL can be understood first.

Possible improvements include:

* Add `GET /customers/:id`
* Add `PUT /customers/:id`
* Add `PATCH /customers/:id`
* Add `DELETE /customers/:id`
* Add input validation
* Add email validation
* Add unique constraints
* Add proper error handling
* Add global error middleware
* Add environment variables
* Add database migrations
* Add database transactions
* Add indexes
* Add pagination
* Add filtering
* Add sorting
* Add search
* Add authentication
* Add authorization
* Add PostgreSQL relationships
* Add foreign keys
* Add joins
* Add database testing
* Add connection-pool configuration
* Add logging
* Add monitoring

A more complete customer API could look like:

```text
                   Customer API
                        │
        ┌───────────────┼───────────────┐
        │               │               │
        ▼               ▼               ▼
     Create           Read            Update
   POST /customers   GET /customers   PUT /customers/:id
        │               │               │
        └───────────────┼───────────────┘
                        │
                        ▼
                    PostgreSQL
                        │
                        ▼
                     Delete
               DELETE /customers/:id
```

---

# 🏢 Production Architecture

As the application grows, the architecture can evolve into:

```text
                              Client
                                │
                                ▼
                           API Gateway
                                │
                                ▼
                         Express API
                                │
                                ▼
                       Customer Service
                                │
                                ▼
                     PostgreSQL Connection
                            Pool
                                │
                                ▼
                          PostgreSQL
                                │
                  ┌─────────────┼─────────────┐
                  │             │             │
                  ▼             ▼             ▼
              customers      orders       payments
```

The application can then introduce:

* Database migrations
* Transactions
* Indexing
* Read replicas
* Caching
* Connection-pool tuning
* Monitoring
* Backups
* High availability
* Authentication
* Authorization

---

# 🎓 Learning Outcome

After completing this project, you should be able to explain:

* What PostgreSQL is
* What a relational database is
* What SQL is
* How Node.js connects to PostgreSQL
* What the `pg` package does
* What a PostgreSQL connection pool is
* Why connection pooling matters
* How `pool.query()` works
* How SQL `INSERT` works
* How SQL `SELECT` works
* What `$1` and `$2` represent in parameterized queries
* Why parameterized queries are important
* What `RETURNING *` does
* What `result.rows` contains
* How Express and PostgreSQL work together
* What CRUD means
* How REST endpoints map to database operations
* Why database credentials should not be hardcoded
* Why production applications need database error handling

The key lesson is:

> **A backend API becomes a persistent application when it can reliably communicate with a database. PostgreSQL provides the relational data layer, SQL provides the language for interacting with that data, and Node.js/Express provides the API layer clients communicate with.**

---

# 🔗 Blueprint Information

**Series:** Backend System Design — 40 Project Blueprints

**Project:** 11 / 40

**Concept:** PostgreSQL SQL API

**Focus:** Understanding relational databases, SQL queries, PostgreSQL connections, connection pooling, parameterized queries, and building database-backed REST APIs.

---

# 👨‍💻 Creator

**Andrew Emaye**

This project is part of my practical backend development and system-design learning series, focused on understanding the architectures, patterns, and building blocks used to create scalable applications.

---

# 🔒 Privacy Policy

This project is an educational backend application and does not intentionally collect, sell, or share personal user information.

The customer records used in this project are intended for development and educational purposes.

If this project is extended to process real customer information, appropriate privacy, security, authentication, authorization, and data-protection measures should be implemented.

---

# 📄 License

This project is licensed under the **MIT License**.

You are free to use, copy, modify, merge, publish, distribute, sublicense, and sell copies of the project, subject to the conditions of the MIT License.

See the `LICENSE` file in this repository for the full license text.

---

## ⭐ Keep Learning

**Build it. Break it. Understand it. Scale it.**
