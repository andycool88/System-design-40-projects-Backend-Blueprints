# Project 04 — HTTP Status Codes

A practical Express.js API designed to demonstrate the most common **HTTP status codes** used by backend applications.

Instead of performing complex business operations, this project provides simple endpoints that intentionally return different HTTP status codes. This makes it easy to understand what each status code means and when a backend should use it.

This is the fourth blueprint in the **Backend System Design — 40 Project Blueprints** series.

---

## 🎯 What This Project Teaches

This project focuses on understanding HTTP status codes and how they communicate the result of an API request.

You will learn:

* What HTTP status codes are
* `200 OK`
* `201 Created`
* `400 Bad Request`
* `401 Unauthorized`
* `500 Internal Server Error`
* How Express sets HTTP status codes
* How APIs communicate success and failure
* How clients can interpret server responses

The goal is to understand that an API response contains more than just data — the **status code tells the client what happened**.

---

# 🌐 What Are HTTP Status Codes?

An HTTP status code is a three-digit number returned by a server to communicate the result of an HTTP request.

For example:

```text
200 OK
```

means the request was successful.

While:

```text
404 Not Found
```

means the requested resource could not be found.

Status codes are grouped into five major categories:

| Range | Category      | Meaning                                |
| ----- | ------------- | -------------------------------------- |
| `1xx` | Informational | Request received / processing          |
| `2xx` | Success       | Request completed successfully         |
| `3xx` | Redirection   | Further action or redirection required |
| `4xx` | Client Error  | Problem with the client's request      |
| `5xx` | Server Error  | Problem on the server                  |

This project focuses primarily on `2xx`, `4xx`, and `5xx` responses.

---

# 🏗️ Architecture

```text
                 Client
                   │
                   │ HTTP Request
                   ▼
            ┌───────────────┐
            │ Express Server│
            └───────┬───────┘
                    │
                    ▼
               Route Handler
                    │
          ┌─────────┼─────────┐
          │         │         │
          ▼         ▼         ▼
        200       400       401 / 500
          │         │         │
          └─────────┼─────────┘
                    │
                    ▼
             JSON Response
```

The server intentionally provides different routes so you can observe different HTTP responses.

---

# 📡 API Endpoints

## 1. Successful Request — 200 OK

```http
GET /success
```

This endpoint simulates a successful request.

### Request

```bash
curl http://localhost:6000/success
```

### Response

```json
{
  "message": "OK"
}
```

### Status

```text
200 OK
```

### What It Means

`200 OK` means the server successfully processed the request.

It is commonly used when retrieving or successfully processing a resource.

---

# 2. Resource Creation — 201 Created

```http
POST /create
```

This endpoint simulates successfully creating a new resource.

The API expects a `name` property in the request body.

### Valid Request

```bash
curl -X POST http://localhost:6000/create \
-H "Content-Type: application/json" \
-d '{"name":"Andrew"}'
```

### Response

```json
{
  "message": "Resource created"
}
```

### Status

```text
201 Created
```

### What It Means

`201 Created` indicates that a new resource was successfully created.

It is commonly returned after successful `POST` operations.

---

# 3. Bad Request — 400

```http
POST /create
```

If the client does not provide the required `name` field, the server returns a `400 Bad Request`.

### Request

```bash
curl -X POST http://localhost:6000/create \
-H "Content-Type: application/json" \
-d '{}'
```

### Response

```json
{
  "error": "Bad Request: name required"
}
```

### Status

```text
400 Bad Request
```

### What It Means

`400` indicates that the server cannot process the request because something about the client's request is invalid.

Common causes include:

* Missing required fields
* Invalid request data
* Malformed requests
* Invalid parameters

---

# 4. Unauthorized — 401

```http
GET /unauthorized
```

This endpoint intentionally simulates an unauthorized request.

### Request

```bash
curl http://localhost:6000/unauthorized
```

### Response

```json
{
  "error": "Unauthorized"
}
```

### Status

```text
401 Unauthorized
```

### What It Means

`401 Unauthorized` indicates that authentication is required or the supplied authentication credentials are not valid.

For example, a protected API might return `401` when a user attempts to access an endpoint without a valid authentication token.

> In a production application, this route would normally contain authentication logic rather than simply returning `401`.

---

# 5. Internal Server Error — 500

```http
GET /server-error
```

This endpoint intentionally simulates a server-side failure.

### Request

```bash
curl http://localhost:6000/server-error
```

### Response

```json
{
  "error": "Internal Server Error"
}
```

### Status

```text
500 Internal Server Error
```

### What It Means

`500` indicates that something went wrong while processing the request on the server.

Possible causes include:

* Unexpected application errors
* Database failures
* Unhandled exceptions
* Infrastructure problems
* Internal service failures

The project intentionally returns the status to demonstrate how a backend communicates a server-side error.

---

# 📊 Status Code Summary

| Endpoint        | Method | Status | Meaning                        |
| --------------- | ------ | -----: | ------------------------------ |
| `/success`      | `GET`  |  `200` | Request successful             |
| `/create`       | `POST` |  `201` | Resource created               |
| `/create`       | `POST` |  `400` | Invalid request                |
| `/unauthorized` | `GET`  |  `401` | Authentication required/failed |
| `/server-error` | `GET`  |  `500` | Server-side error              |

---

# 🧠 Key Concepts

## 1. `res.status()`

Express allows you to explicitly set the HTTP status code using:

```javascript
res.status(200)
```

You can then send a JSON response:

```javascript
res.status(200).json({
  message: "OK"
});
```

This tells the client both **what happened** and provides additional response data.

---

## 2. Success vs Error Responses

An API should communicate whether an operation succeeded or failed.

For example:

```text
Successful Request
       ↓
    200 OK
```

or:

```text
Invalid Request
       ↓
400 Bad Request
```

or:

```text
Server Failure
       ↓
500 Internal Server Error
```

This allows clients such as frontend applications, mobile applications, and other backend services to react appropriately.

---

# 🔄 HTTP Response Flow

```text
Client
  │
  │ HTTP Request
  ▼
Express API
  │
  ▼
Route Handler
  │
  ├── Success ──────────► 200
  │
  ├── Resource Created ─► 201
  │
  ├── Bad Request ──────► 400
  │
  ├── Unauthorized ─────► 401
  │
  └── Server Error ─────► 500
```

---

# 🛡️ Why Status Codes Matter

Imagine a frontend application making this request:

```http
POST /create
```

If the API responds with:

```text
201 Created
```

the frontend knows the operation succeeded.

If it receives:

```text
400 Bad Request
```

the frontend knows that the request needs to be corrected.

If it receives:

```text
500 Internal Server Error
```

the frontend knows the problem occurred on the server rather than necessarily being caused by the user's input.

This makes status codes an essential part of communication between distributed systems.

---

# 📦 JSON Responses

The project uses:

```javascript
app.use(express.json());
```

This allows Express to parse incoming JSON request bodies.

For example:

```json
{
  "name": "Andrew"
}
```

can be accessed through:

```javascript
req.body.name
```

The API then returns JSON responses using:

```javascript
res.json(...)
```

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
http://localhost:6000
```

You should see:

```text
Status API running on port 6000
```

---

# 🧪 Testing the API

You can test the endpoints using:

* Browser
* Postman
* cURL
* Thunder Client
* VS Code REST Client
* Insomnia

### Test 200

```bash
curl http://localhost:6000/success
```

### Test 201

```bash
curl -X POST http://localhost:6000/create \
-H "Content-Type: application/json" \
-d '{"name":"Andrew"}'
```

### Test 400

```bash
curl -X POST http://localhost:6000/create \
-H "Content-Type: application/json" \
-d '{}'
```

### Test 401

```bash
curl http://localhost:6000/unauthorized
```

### Test 500

```bash
curl http://localhost:6000/server-error
```

---

# 📁 Project Structure

```text
project-04/
│
├── index.js
├── package.json
└── README.md
```

### `index.js`

Contains the Express application and routes used to demonstrate different HTTP status codes.

### `package.json`

Contains the Node.js project configuration and dependencies.

### `README.md`

Contains the documentation for the project and the concepts demonstrated.

---

# 💡 Possible Improvements

This project intentionally uses simple routes to isolate the concept of HTTP status codes.

Possible improvements include:

* Add a real database
* Add authentication for the `401` example
* Add centralized error handling
* Create custom error classes
* Add `403 Forbidden`
* Add `404 Not Found`
* Add `409 Conflict`
* Add `422 Unprocessable Entity`
* Add `429 Too Many Requests`
* Add more `2xx` responses
* Add automated API tests
* Add structured error responses
* Add request logging

These concepts become increasingly important as APIs become larger and more distributed.

---

# 🎓 Learning Outcome

After completing this project, you should be able to explain:

* What HTTP status codes are
* What the `1xx–5xx` categories represent
* When to use `200 OK`
* When to use `201 Created`
* When to use `400 Bad Request`
* When to use `401 Unauthorized`
* What `500 Internal Server Error` means
* How Express sets HTTP status codes
* Why status codes matter to API consumers
* How successful and failed API responses should be communicated

The key lesson is:

> **An API response should clearly communicate not only the data returned, but also the outcome of the request.**

---

# 🔗 Blueprint Information

**Series:** Backend System Design — 40 Project Blueprints

**Project:** 04 / 40

**Concept:** HTTP Status Codes

**Focus:** Understanding how backend APIs communicate successful requests, client errors, authentication failures, and server errors.

---

# 👨‍💻 Creator

**Andrew Emaye**

This project is part of my practical backend development and system-design learning series, focused on understanding the architectures, patterns, and building blocks used to create scalable applications.

---

# 🔒 Privacy Policy

This project is an educational backend application and does not intentionally collect, store, sell, or share personal user information.

The project does not use a database or intentionally persist user data. Any request data submitted while testing the API is processed only by the local application.

If this project is extended to process real user information, databases, authentication, analytics, or third-party services, appropriate privacy and data-protection measures should be implemented.

---

# 📄 License

This project is licensed under the **MIT License**.

You are free to use, copy, modify, merge, publish, distribute, sublicense, and sell copies of the project, subject to the conditions of the MIT License.

See the `LICENSE` file in this repository for the full license text.

---

## ⭐ Keep Learning

**Build it. Break it. Understand it. Scale it.**
