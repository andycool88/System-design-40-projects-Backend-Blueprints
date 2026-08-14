# Project 05 — Stateful vs Stateless Authentication

A practical Express.js project demonstrating the fundamental difference between **stateless token-based authentication** and **stateful session-based authentication**.

This project implements both approaches in a single application, allowing you to see how authentication state is handled differently between tokens and server-side sessions.

This is the fifth blueprint in the **Backend System Design — 40 Project Blueprints** series.

---

## 🎯 What This Project Teaches

This project focuses on two fundamental authentication architectures:

* Stateless authentication
* Stateful authentication
* Token-based authentication
* Session-based authentication
* HTTP `Authorization` headers
* Express sessions
* Authentication checks
* `401 Unauthorized`
* The difference between client-held and server-held authentication state

The goal is to understand **where authentication state lives and how the server determines whether a request is authenticated**.

---

## 🔐 Stateful vs Stateless Authentication

Authentication can be designed in different ways.

This project demonstrates two approaches.

### Stateless Authentication

The client sends an authentication token with every request.

```text
Client
  │
  │ Authorization: Bearer secret123
  ▼
Server
  │
  │ Validate Token
  ▼
Response
```

The server does not need to maintain a login session for the client.

### Stateful Authentication

The server creates and maintains a session after login.

```text
Client
  │
  │ Login
  ▼
Server
  │
  │ Create Session
  ▼
Session
  │
  ▼
Client
  │
  │ Session Cookie
  ▼
Server
  │
  │ Check Session
  ▼
Response
```

The server maintains authentication state associated with the session.

---

## 🏗️ Architecture

```text
                         Client
                           │
              ┌────────────┴────────────┐
              │                         │
              ▼                         ▼
        Stateless Auth            Stateful Auth
              │                         │
              ▼                         ▼
     Authorization Header         Session Cookie
              │                         │
              ▼                         ▼
       Validate Token             Check Session
              │                         │
              └────────────┬────────────┘
                           ▼
                      API Response
```

---

## 📡 API Endpoints

| Method | Endpoint     | Authentication Type |
| ------ | ------------ | ------------------- |
| `GET`  | `/stateless` | Token-based         |
| `POST` | `/login`     | Session-based       |
| `GET`  | `/stateful`  | Session-based       |

---

# 1. Stateless Authentication

```http
GET /stateless
```

The stateless endpoint expects an authentication token in the HTTP `Authorization` header.

### Required Header

```http
Authorization: Bearer secret123
```

The server reads the header using:

```javascript
req.headers["authorization"]
```

It then compares the supplied token with the expected value.

### Successful Request

```bash
curl http://localhost:7000/stateless \
-H "Authorization: Bearer secret123"
```

### Response

```json
{
  "message": "Stateless auth success"
}
```

### Invalid Token

If the token is missing or incorrect:

```bash
curl http://localhost:7000/stateless
```

The API returns:

```json
{
  "error": "Invalid token"
}
```

with:

```text
401 Unauthorized
```

---

## 🧠 How Stateless Authentication Works

The request contains the information needed by the server to perform the authentication check.

```text
Request
   │
   ├── Authorization Header
   │
   ▼
Server
   │
   ├── Read Token
   │
   ├── Validate Token
   │
   └── Return Response
```

The important idea is that the server does not use a login session to determine the user's authentication state for this endpoint.

In this project, the token is simply:

```text
Bearer secret123
```

This is a **demonstration token**, not a production authentication implementation.

---

# 2. Stateful Authentication

The project also demonstrates authentication using Express sessions.

The application configures the session middleware:

```javascript
app.use(
  session({
    secret: "keyboard cat",
    resave: false,
    saveUninitialized: true
  })
);
```

The session allows the server to maintain information associated with the user's session.

---

# 🔑 Login

```http
POST /login
```

The login route creates a session for the user.

The project stores:

```javascript
req.session.user = "Andrew";
```

### Request

```bash
curl -X POST http://localhost:7000/login \
-c cookies.txt
```

### Response

```json
{
  "message": "Logged in with session"
}
```

The session is now associated with the client.

---

# 👤 Stateful Authentication Check

After logging in, the client can access:

```http
GET /stateful
```

The server checks:

```javascript
req.session.user
```

If the session contains the user:

```json
{
  "message": "Hello Andrew"
}
```

---

## ❌ Not Logged In

If there is no authenticated session:

```json
{
  "error": "Not logged in"
}
```

with:

```text
401 Unauthorized
```

---

# 🍪 Testing the Session with cURL

Because sessions use cookies, you can save the cookie returned during login.

### Step 1 — Login

```bash
curl -X POST http://localhost:7000/login \
-c cookies.txt
```

The `-c cookies.txt` option stores the session cookie.

### Step 2 — Access Stateful Route

```bash
curl http://localhost:7000/stateful \
-b cookies.txt
```

Expected response:

```json
{
  "message": "Hello Andrew"
}
```

Without the session cookie:

```bash
curl http://localhost:7000/stateful
```

the server responds with:

```json
{
  "error": "Not logged in"
}
```

---

# ⚖️ Stateless vs Stateful

| Feature                 | Stateless              | Stateful                   |
| ----------------------- | ---------------------- | -------------------------- |
| Authentication state    | Sent with request      | Maintained through session |
| Example                 | Bearer token           | Session                    |
| Server session required | No                     | Yes                        |
| Authentication data     | Token                  | Session                    |
| Request example         | `Authorization` header | Session cookie             |
| Project endpoint        | `/stateless`           | `/stateful`                |
| Login session           | Not used               | Used                       |

---

# 🔄 Authentication Flow

## Stateless

```text
Client
  │
  │ GET /stateless
  │ Authorization: Bearer secret123
  ▼
Express
  │
  ▼
Read Authorization Header
  │
  ▼
Validate Token
  │
  ├── Valid ──────► Success
  │
  └── Invalid ────► 401
```

## Stateful

```text
Client
  │
  │ POST /login
  ▼
Express
  │
  ▼
Create Session
  │
  ▼
Session Cookie
  │
  ▼
Client
  │
  │ GET /stateful
  │ Cookie: session
  ▼
Express
  │
  ▼
Check Session
  │
  ├── Exists ─────► Success
  │
  └── Missing ────► 401
```

---

# 🧠 Key Concepts

## 1. Authorization Header

The stateless endpoint reads:

```javascript
req.headers["authorization"]
```

The client sends:

```http
Authorization: Bearer secret123
```

The server can then validate the provided credentials.

---

## 2. Bearer Token

The project uses:

```text
Bearer secret123
```

The `Bearer` prefix indicates that the client is presenting a token as proof of authorization.

In real applications, bearer tokens are commonly generated securely and may be represented by formats such as JWTs or opaque access tokens.

This project intentionally uses a hard-coded value to keep the authentication architecture easy to understand.

---

## 3. Express Session

The project uses:

```javascript
const session = require("express-session");
```

and configures it with:

```javascript
app.use(
  session({
    secret: "keyboard cat",
    resave: false,
    saveUninitialized: true
  })
);
```

The session middleware allows the application to store information associated with a client's session.

---

## 4. Session Data

The login route stores:

```javascript
req.session.user = "Andrew";
```

Later, the stateful endpoint checks:

```javascript
if (req.session.user)
```

This allows the server to determine whether the client has an authenticated session.

---

# 🚨 Important Security Note

The credentials in this project are intentionally simplified for educational purposes.

The following should **not** be used in production:

```text
secret123
```

or:

```text
keyboard cat
```

A production application should use:

* Secure secrets
* Environment variables
* Proper password hashing
* Secure token generation
* HTTPS
* Secure cookies
* Appropriate session storage
* Token expiration
* Authentication and authorization controls

This project focuses on understanding the **architecture**, not implementing production-grade authentication.

---

# 📦 Technologies

* **Node.js**
* **Express.js**
* **express-session**
* **JavaScript**
* **HTTP**
* **JSON**
* **Cookies**
* **Bearer Authentication**

---

# 🚀 Getting Started

## Prerequisites

Make sure Node.js and npm are installed:

```bash
node -v
npm -v
```

## 1. Install Dependencies

From the project directory:

```bash
npm install
```

## 2. Start the Server

```bash
node index.js
```

The server will run on:

```text
http://localhost:7000
```

You should see:

```text
State API running on port 7000
```

---

# 🧪 Testing

You can test the API using:

* Postman
* cURL
* Thunder Client
* VS Code REST Client
* Insomnia

## Test Stateless Authentication

### Valid Token

```bash
curl http://localhost:7000/stateless \
-H "Authorization: Bearer secret123"
```

Expected:

```json
{
  "message": "Stateless auth success"
}
```

### Invalid Token

```bash
curl http://localhost:7000/stateless \
-H "Authorization: Bearer wrongtoken"
```

Expected:

```json
{
  "error": "Invalid token"
}
```

---

## Test Stateful Authentication

### Login

```bash
curl -X POST http://localhost:7000/login \
-c cookies.txt
```

Expected:

```json
{
  "message": "Logged in with session"
}
```

### Access Protected Route

```bash
curl http://localhost:7000/stateful \
-b cookies.txt
```

Expected:

```json
{
  "message": "Hello Andrew"
}
```

### Access Without Session

```bash
curl http://localhost:7000/stateful
```

Expected:

```json
{
  "error": "Not logged in"
}
```

---

# 📁 Project Structure

```text
project-05/
│
├── index.js
├── package.json
└── README.md
```

### `index.js`

Contains the Express application, stateless authentication route, session configuration, login route, stateful authentication route, and server configuration.

### `package.json`

Contains the Node.js project configuration and dependencies.

### `README.md`

Contains the documentation for the project and the authentication concepts demonstrated.

---

# 💡 Possible Improvements

This project intentionally uses simplified authentication mechanisms.

Possible improvements include:

* Replace the hard-coded token with JWT authentication
* Add user registration
* Hash passwords with bcrypt
* Add a database
* Add refresh tokens
* Add token expiration
* Add role-based authorization
* Add permission-based authorization
* Store sessions in Redis
* Configure secure cookies
* Add CSRF protection
* Add authentication middleware
* Move secrets into environment variables
* Add logout functionality
* Add automated authentication tests

These improvements introduce more realistic authentication architecture used in production backend systems.

---

# 🎓 Learning Outcome

After completing this project, you should be able to explain:

* What authentication is
* What stateless authentication means
* What stateful authentication means
* How bearer tokens work
* How the `Authorization` header is used
* What an Express session is
* How session cookies maintain authentication state
* The difference between token-based and session-based authentication
* Why authentication state matters in distributed applications
* Why production authentication requires stronger security controls

The key lesson is:

> **Stateless authentication keeps authentication information with the request, while stateful authentication relies on server-maintained session state.**

---

# 🔗 Blueprint Information

**Series:** Backend System Design — 40 Project Blueprints

**Project:** 05 / 40

**Concept:** Stateful vs Stateless Authentication

**Focus:** Understanding how backend systems manage authentication state using tokens and server-side sessions.

---

# 👨‍💻 Creator

**Andrew Emaye**

This project is part of my practical backend development and system-design learning series, focused on understanding the architectures, patterns, and building blocks used to create scalable applications.

---

# 🔒 Privacy Policy

This project is an educational backend application and does not intentionally collect, sell, or share personal user information.

The user information used in the session example is mock data created specifically for demonstration purposes.

The project does not implement a production user database or real authentication system.

If this project is extended to process real user information, appropriate privacy, security, authentication, and data-protection measures should be implemented.

---

# 📄 License

This project is licensed under the **MIT License**.

You are free to use, copy, modify, merge, publish, distribute, sublicense, and sell copies of the project, subject to the conditions of the MIT License.

See the `LICENSE` file in this repository for the full license text.

---

## ⭐ Keep Learning

**Build it. Break it. Understand it. Scale it.**
