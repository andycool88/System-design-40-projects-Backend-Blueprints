# Project 02 — REST vs GraphQL

A practical comparison of **REST and GraphQL APIs** using the same user lookup functionality.

This project implements a simple user API twice: first with **Express and REST**, and then with **Apollo Server and GraphQL**. The purpose is to understand how the two API approaches structure requests, define data, and return responses.

This is the second blueprint in the **Backend System Design — 40 Project Blueprints** series.

---

## 🎯 What This Project Teaches

This project focuses on understanding the fundamental differences between REST and GraphQL:

* REST API endpoints
* GraphQL schemas
* GraphQL queries
* GraphQL resolvers
* URL parameters
* GraphQL arguments
* JSON responses
* Apollo Server
* Express.js
* Comparing REST and GraphQL approaches

The same basic operation — **fetching a user by ID** — is implemented using both architectures.

---

# 🔄 REST vs GraphQL

The project exposes the same user data through two different API styles.

### REST

The REST API uses a dedicated HTTP endpoint:

```http
GET /users/:id
```

For example:

```http
GET /users/1
```

The ID is provided through the URL.

---

### GraphQL

The GraphQL API defines a single query:

```graphql
user(id: ID!): User
```

The client specifies the user ID as an argument in the GraphQL query.

Example:

```graphql
query {
  user(id: "1") {
    id
    name
    email
  }
}
```

The client also specifies exactly which fields it wants returned.

---

# 🏗️ Architecture

## REST Architecture

```text
Client
   │
   │ GET /users/1
   ▼
Express Server
   │
   ▼
REST Route
   │
   ▼
Find User
   │
   ▼
JSON Response
```

## GraphQL Architecture

```text
Client
   │
   │ GraphQL Query
   ▼
Apollo Server
   │
   ▼
GraphQL Schema
   │
   ▼
Resolver
   │
   ▼
Find User
   │
   ▼
GraphQL Response
```

---

# 📡 REST API

## Endpoint

```http
GET /users/:id
```

### Example Request

```http
GET /users/1
```

### Response

```json
{
  "id": 1,
  "name": "Andrew",
  "email": "andrew@example.com"
}
```

The Express route uses the URL parameter to locate the requested user:

```javascript
const user = users.find(u => u.id == req.params.id);
```

The result is returned using:

```javascript
res.json(user);
```

---

# 🔷 GraphQL API

The GraphQL implementation uses **Apollo Server**.

## Schema

The project defines a `User` type:

```graphql
type User {
  id: ID!
  name: String
  email: String
}
```

It also defines a query for retrieving a user:

```graphql
type Query {
  user(id: ID!): User
}
```

---

## GraphQL Query

A client can request a user using:

```graphql
query {
  user(id: "1") {
    id
    name
    email
  }
}
```

The client determines which fields should be returned.

For example, it could request only:

```graphql
query {
  user(id: "1") {
    name
  }
}
```

This demonstrates one of the important differences between the two approaches: **GraphQL allows the client to specify the fields it needs.**

---

# 🧩 GraphQL Resolver

The resolver contains the logic responsible for retrieving the requested user:

```javascript
const resolvers = {
  Query: {
    user: (_, { id }) => users.find(u => u.id === id),
  },
};
```

The resolver receives the `id` argument and searches the mock user data.

---

# 🧠 Key Concepts

## REST

REST organizes functionality around **resources and endpoints**.

In this project:

```text
/users/1
```

represents a request for a specific user resource.

The HTTP method indicates the intended operation:

```text
GET → Retrieve
POST → Create
PUT → Replace
PATCH → Update
DELETE → Remove
```

This project specifically demonstrates `GET`.

---

## GraphQL

GraphQL organizes the API around a **schema and queries**.

Instead of creating an endpoint specifically for every resource representation, the client sends a query describing the data it wants.

Example:

```graphql
user(id: "1") {
  name
  email
}
```

The GraphQL server uses the schema and resolver to fulfill the request.

---

# ⚖️ REST vs GraphQL

| Feature            | REST                                 | GraphQL                           |
| ------------------ | ------------------------------------ | --------------------------------- |
| API structure      | Multiple endpoints                   | Schema + queries                  |
| Data request       | Endpoint determines resource         | Client specifies requested fields |
| Parameters         | URL/query parameters                 | Query arguments                   |
| Schema             | Usually documented separately        | Built into GraphQL schema         |
| Data retrieval     | Server determines response structure | Client determines selected fields |
| Example            | `GET /users/1`                       | `user(id: "1")`                   |
| Project technology | Express.js                           | Apollo Server                     |

---

# 🔍 Same Problem, Different Architecture

Both implementations solve the same basic problem:

> **Find a user by ID and return the user's information.**

### REST

```text
GET /users/1
       ↓
Express Route
       ↓
Find User
       ↓
JSON Response
```

### GraphQL

```text
user(id: "1")
       ↓
GraphQL Schema
       ↓
Resolver
       ↓
Find User
       ↓
GraphQL Response
```

The important lesson is that **the underlying business operation can remain the same while the API architecture changes.**

---

# 📦 Technologies

### REST Implementation

* Node.js
* Express.js
* JavaScript
* HTTP
* JSON

### GraphQL Implementation

* Node.js
* Apollo Server
* GraphQL
* JavaScript

---

# 🚀 Getting Started

Because the project contains two separate implementations, run the REST and GraphQL servers independently.

## REST API

Navigate to the REST project:

```bash
cd rest
```

Install dependencies:

```bash
npm install
```

Start the server:

```bash
node index.js
```

The REST API runs on:

```text
http://localhost:4000
```

Test it with:

```text
http://localhost:4000/users/1
```

---

## GraphQL API

Navigate to the GraphQL project:

```bash
cd graphql
```

Install dependencies:

```bash
npm install
```

Start the server:

```bash
node index.js
```

Apollo Server will start the GraphQL API and print the server URL in the terminal.

---

# 📁 Suggested Project Structure

```text
project-02/
│
├── rest/
│   ├── index.js
│   ├── package.json
│   └── README.md
│
├── graphql/
│   ├── index.js
│   ├── package.json
│   └── README.md
│
└── README.md
```

---

# 🧪 Testing

## REST

Using cURL:

```bash
curl http://localhost:4000/users/1
```

Expected response:

```json
{
  "id": 1,
  "name": "Andrew",
  "email": "andrew@example.com"
}
```

---

## GraphQL

Send the following query through a GraphQL client:

```graphql
query {
  user(id: "1") {
    id
    name
    email
  }
}
```

Expected data:

```json
{
  "data": {
    "user": {
      "id": "1",
      "name": "Andrew",
      "email": "andrew@example.com"
    }
  }
}
```

---

# 💡 Possible Improvements

This project intentionally uses simple mock data to focus on the API architecture.

Possible extensions include:

* Connect both APIs to PostgreSQL
* Add user creation and updates
* Add authentication
* Add validation
* Add error handling
* Add pagination
* Add multiple GraphQL queries
* Add GraphQL mutations
* Add nested GraphQL relationships
* Add automated tests
* Compare API performance
* Add API documentation

---

# 🎓 Learning Outcome

After completing this project, you should be able to explain:

* What a REST API is
* What GraphQL is
* How REST endpoints work
* How GraphQL schemas work
* What GraphQL resolvers do
* How URL parameters differ from GraphQL arguments
* How clients request data through REST
* How clients request specific fields through GraphQL
* The architectural differences between REST and GraphQL

Most importantly, you should understand that **REST and GraphQL are different ways of designing the API layer**, while the underlying business logic can remain largely the same.

---

# 🔗 Blueprint Information

**Series:** Backend System Design — 40 Project Blueprints

**Project:** 02 / 40

**Concept:** REST vs GraphQL

**Focus:** Comparing resource-based REST APIs with schema-driven GraphQL APIs.

---

# 👨‍💻 Creator

**Andrew Emaye**

This project is part of my practical backend development and system-design learning series, focused on understanding the architectures and patterns used to build scalable applications.

---

# 🔒 Privacy Policy

This project is an educational API implementation and does not intentionally collect, store, sell, or share personal user information.

The user information included in this project is **mock data** used strictly for demonstration purposes. It is not connected to a real user database or external user account system.

If the project is extended to collect or process real user information, appropriate privacy and data-protection measures should be implemented.

---

# 📄 License

This project is licensed under the **MIT License**.

You are free to use, copy, modify, merge, publish, distribute, sublicense, and sell copies of the project, subject to the conditions of the MIT License.

See the `LICENSE` file in this repository for the full license text.

---

## ⭐ Keep Learning

**Build it. Compare it. Understand it. Scale it.**
