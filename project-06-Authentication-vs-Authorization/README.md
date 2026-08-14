# Project 06 — Authentication vs Authorization

A practical Express.js project demonstrating the fundamental difference between **authentication** and **authorization**.

This project implements a simple login system and an admin-only endpoint to show how a backend first determines **who the user is** and then determines **what that user is allowed to access**.

This is the sixth blueprint in the **Backend System Design — 40 Project Blueprints** series.

---

## 🎯 What This Project Teaches

This project focuses on two core security concepts:

* Authentication
* Authorization
* Login credentials
* User roles
* `401 Unauthorized`
* `403 Forbidden`
* Request headers
* Role-based access control
* Protecting restricted resources

The key goal is to understand:

> **Authentication asks "Who are you?" while authorization asks "What are you allowed to do?"**

---

# 🔐 Authentication vs Authorization

Although authentication and authorization are closely related, they are different processes.

### Authentication

Authentication verifies the identity of a user.

In this project:

```text
Username + Password
        ↓
    Find User
        ↓
Valid Credentials?
        ↓
      Login
```

### Authorization

Authorization determines whether an authenticated user has permission to perform a particular action.

In this project:

```text
User Role
   ↓
Is role "admin"?
   ↓
 ┌───┴────┐
Yes       No
 ↓         ↓
Allow     403
```

---

# 🏗️ Architecture

```text
                         Client
                           │
                           │
                           ▼
                    ┌─────────────┐
                    │ Login Route │
                    └──────┬──────┘
                           │
                           ▼
                    Check Credentials
                           │
                 ┌─────────┴─────────┐
                 │                   │
              Invalid              Valid
                 │                   │
                 ▼                   ▼
               401              User Role
                                     │
                                     ▼
                              Protected Route
                                     │
                              ┌──────┴──────┐
                              │             │
                            Admin        Non-Admin
                              │             │
                              ▼             ▼
                           Allow           403
```

---

# 📡 API Endpoints

| Method | Endpoint | Purpose                    |
| ------ | -------- | -------------------------- |
| `POST` | `/login` | Authenticate a user        |
| `GET`  | `/admin` | Access admin-only resource |

---

# 1. Authentication — Login

```http
POST /login
```

The login endpoint receives a username and password.

### Request Body

```json
{
  "username": "andrew",
  "password": "pass123"
}
```

The server searches the mock user database:

```javascript
const user = users.find(
  u => u.username === username && u.password === password
);
```

If the credentials match, authentication succeeds.

---

## ✅ Successful Login

### Request

```bash
curl -X POST http://localhost:8000/login \
-H "Content-Type: application/json" \
-d '{"username":"andrew","password":"pass123"}'
```

### Response

```json
{
  "message": "Login successful",
  "role": "admin"
}
```

The response tells the client that authentication was successful and identifies the user's role.

---

# ❌ Invalid Login

If the username or password is incorrect:

```bash
curl -X POST http://localhost:8000/login \
-H "Content-Type: application/json" \
-d '{"username":"andrew","password":"wrongpassword"}'
```

The API returns:

```json
{
  "error": "Invalid credentials"
}
```

with:

```text
401 Unauthorized
```

---

# 🔑 Understanding 401 Unauthorized

A `401 Unauthorized` response is used when the request does not contain valid authentication credentials.

In this project, that happens when:

```text
Username + Password
        ↓
    Validation
        ↓
Invalid
        ↓
401 Unauthorized
```

The user has failed to authenticate.

---

# 2. Authorization — Admin Access

```http
GET /admin
```

The `/admin` endpoint represents a protected resource that should only be accessible to administrators.

The project reads the user's role from a request header:

```http
role: admin
```

The server checks:

```javascript
const role = req.headers["role"];
```

Then:

```javascript
if (role === "admin") {
  // Allow access
}
```

---

## ✅ Admin Access

### Request

```bash
curl http://localhost:8000/admin \
-H "role: admin"
```

### Response

```json
{
  "message": "Welcome Admin"
}
```

The request is allowed because the supplied role is:

```text
admin
```

---

# ❌ Non-Admin Access

If the request contains:

```http
role: user
```

the server rejects the request.

### Request

```bash
curl http://localhost:8000/admin \
-H "role: user"
```

### Response

```json
{
  "error": "Forbidden: Admins only"
}
```

with:

```text
403 Forbidden
```

---

# 🚫 Understanding 403 Forbidden

A `403 Forbidden` response means the server understands the request, but the user does not have sufficient permission to perform the requested operation.

The distinction is important:

```text
401
↓
Authentication problem
"Who are you?"
```

```text
403
↓
Authorization problem
"You are authenticated, but you cannot do this."
```

---

# ⚖️ Authentication vs Authorization

| Concept          | Authentication      | Authorization        |
| ---------------- | ------------------- | -------------------- |
| Main question    | Who are you?        | What can you access? |
| Purpose          | Verify identity     | Verify permissions   |
| Example          | Username + password | Admin role           |
| Project endpoint | `/login`            | `/admin`             |
| Failure status   | `401`               | `403`                |
| Project data     | Credentials         | User role            |

---

# 🔄 Complete Security Flow

```text
                    Client
                      │
                      ▼
                  POST /login
                      │
                      ▼
              Username + Password
                      │
                      ▼
             Authentication Check
                      │
             ┌────────┴────────┐
             │                 │
           Invalid            Valid
             │                 │
             ▼                 ▼
            401             User Role
                               │
                               ▼
                         GET /admin
                               │
                               ▼
                      Authorization Check
                               │
                    ┌──────────┴──────────┐
                    │                     │
                  Admin                User
                    │                     │
                    ▼                     ▼
                  Allow                  403
```

---

# 🧠 Key Concepts

## 1. Authentication

Authentication verifies a user's identity.

The project uses:

```text
username
password
```

to find a matching user.

```javascript
const user = users.find(
  u => u.username === username &&
       u.password === password
);
```

If a matching user is found, authentication succeeds.

---

## 2. Authorization

Authorization determines whether the authenticated user has permission to access a resource.

The project uses the user's role:

```text
admin
user
```

The `/admin` endpoint only allows:

```text
admin
```

---

## 3. Roles

The mock users contain a `role` property:

```javascript
{
  id: 1,
  username: "andrew",
  password: "pass123",
  role: "admin"
}
```

and:

```javascript
{
  id: 2,
  username: "john",
  password: "pass456",
  role: "user"
}
```

This demonstrates a basic form of **role-based access control (RBAC)**.

---

# 👥 Role-Based Access Control

Role-based access control means that permissions can be associated with a user's role.

For example:

```text
Admin
 ├── View users
 ├── Delete users
 ├── Manage settings
 └── Manage products

User
 ├── View profile
 └── View products
```

This project simplifies that concept to:

```text
admin → Can access /admin
user  → Cannot access /admin
```

---

# 📊 HTTP Status Codes

This project demonstrates two important authentication and authorization status codes.

| Status | Meaning      | Project Usage                   |
| ------ | ------------ | ------------------------------- |
| `401`  | Unauthorized | Invalid login credentials       |
| `403`  | Forbidden    | User lacks required permissions |

### 401

```text
Authentication failed
```

### 403

```text
Authentication may have succeeded,
but authorization failed.
```

---

# 🚨 Important Security Note

The credentials in this project are intentionally simplified for educational purposes.

The passwords are stored directly in the mock data:

```javascript
password: "pass123"
```

This should **never be done in a production application**.

A production authentication system should use:

* Password hashing
* bcrypt or Argon2
* Secure authentication tokens
* Sessions or JWTs
* HTTPS
* Environment variables
* Input validation
* Rate limiting
* Account lockout protections
* Secure password policies
* Proper authorization middleware
* Database-backed users

Also, this project reads the role directly from a request header:

```http
role: admin
```

This is only a **simulation of authorization**.

A real application must not trust a client-provided role header because a client could simply change:

```http
role: user
```

to:

```http
role: admin
```

In production, the server should obtain the user's identity and permissions from a trusted authentication mechanism such as a verified session or token.

---

# 📦 Technologies

* **Node.js**
* **Express.js**
* **JavaScript**
* **HTTP**
* **JSON**
* **Role-Based Access Control**

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
http://localhost:8000
```

You should see:

```text
Auth API running on port 8000
```

---

# 🧪 Testing

You can test the API using:

* Postman
* cURL
* Thunder Client
* VS Code REST Client
* Insomnia

---

## Test Authentication

### Valid Admin Credentials

```bash
curl -X POST http://localhost:8000/login \
-H "Content-Type: application/json" \
-d '{"username":"andrew","password":"pass123"}'
```

Expected:

```json
{
  "message": "Login successful",
  "role": "admin"
}
```

---

### Valid User Credentials

```bash
curl -X POST http://localhost:8000/login \
-H "Content-Type: application/json" \
-d '{"username":"john","password":"pass456"}'
```

Expected:

```json
{
  "message": "Login successful",
  "role": "user"
}
```

---

### Invalid Credentials

```bash
curl -X POST http://localhost:8000/login \
-H "Content-Type: application/json" \
-d '{"username":"andrew","password":"wrong"}'
```

Expected:

```json
{
  "error": "Invalid credentials"
}
```

Status:

```text
401 Unauthorized
```

---

## Test Authorization

### Admin Access

```bash
curl http://localhost:8000/admin \
-H "role: admin"
```

Expected:

```json
{
  "message": "Welcome Admin"
}
```

---

### Non-Admin Access

```bash
curl http://localhost:8000/admin \
-H "role: user"
```

Expected:

```json
{
  "error": "Forbidden: Admins only"
}
```

Status:

```text
403 Forbidden
```

---

# 📁 Project Structure

```text
project-06/
│
├── index.js
├── package.json
└── README.md
```

### `index.js`

Contains the Express application, mock users, login authentication route, admin authorization route, and server configuration.

### `package.json`

Contains the Node.js project configuration and dependencies.

### `README.md`

Contains the documentation for the project and the authentication concepts demonstrated.

---

# 💡 Possible Improvements

This project intentionally uses a simple implementation to isolate authentication and authorization concepts.

Possible improvements include:

* Store users in PostgreSQL or MongoDB
* Hash passwords with bcrypt or Argon2
* Generate JWT access tokens
* Implement session-based authentication
* Create authentication middleware
* Create authorization middleware
* Implement role-based access control
* Implement permission-based access control
* Add refresh tokens
* Add token expiration
* Add user registration
* Add logout
* Add password reset
* Add rate limiting
* Add account lockout
* Add automated security tests
* Store secrets in environment variables

A more realistic architecture would separate authentication from authorization middleware:

```text
Request
   │
   ▼
Authentication Middleware
   │
   │ Verify identity
   ▼
Authorization Middleware
   │
   │ Check permissions
   ▼
Controller
   │
   ▼
Response
```

---

# 🎓 Learning Outcome

After completing this project, you should be able to explain:

* What authentication means
* What authorization means
* The difference between authentication and authorization
* Why `401` and `403` are different
* How username/password authentication works conceptually
* What user roles are
* What role-based access control means
* Why authorization should happen after authentication
* Why client-provided roles cannot be trusted
* How authentication and authorization middleware fit into a backend architecture

The key lesson is:

> **Authentication determines who you are. Authorization determines what you are allowed to do.**

---

# 🔗 Blueprint Information

**Series:** Backend System Design — 40 Project Blueprints

**Project:** 06 / 40

**Concept:** Authentication vs Authorization

**Focus:** Understanding identity verification, user roles, permissions, and access control in backend applications.

---

# 👨‍💻 Creator

**Andrew Emaye**

This project is part of my practical backend development and system-design learning series, focused on understanding the architectures, patterns, and building blocks used to create scalable applications.

---

# 🔒 Privacy Policy

This project is an educational backend application and does not intentionally collect, sell, or share personal user information.

The usernames, passwords, and user roles contained in the project are **mock demonstration data** and are not associated with real user accounts.

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
