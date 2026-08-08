# Project 01 — API Fundamentals

A simple Express.js weather API demonstrating the fundamental concepts behind backend APIs: **routes, HTTP requests, URL parameters, JSON responses, and HTTP status codes**.

This is the first blueprint in the **Backend System Design — 40 Project Blueprints** series.

---

## 🎯 What This Project Teaches

This project focuses on the basic building blocks of an API:

* Creating an Express.js server
* Defining API routes
* Handling `GET` requests
* Using URL parameters
* Returning JSON responses
* Handling successful requests
* Handling `404 Not Found` errors
* Starting a backend server on a specific port

The goal is to understand **what an API does and how a client communicates with a backend server**.

---

## 🏗️ How It Works

The API provides weather information for predefined cities stored in a simple in-memory object.

A client sends a request such as:

```http
GET /api/weather/london
```

The server:

1. Receives the request.
2. Extracts the city from the URL.
3. Converts the city name to lowercase.
4. Searches the mock weather data.
5. Returns the weather information if the city exists.
6. Returns a `404 Not Found` response if the city doesn't exist.

### Request Flow

```text
Client
  │
  │ GET /api/weather/london
  ▼
Express Server
  │
  │ Extract :city parameter
  ▼
Mock Weather Data
  │
  ├── City exists ──► JSON Response
  │
  └── City missing ─► 404 Error
```

---

## 📡 API Endpoint

### Get Weather by City

```http
GET /api/weather/:city
```

### URL Parameter

| Parameter | Description                                                        |
| --------- | ------------------------------------------------------------------ |
| `city`    | The name of the city whose weather information should be retrieved |

---

## ✅ Successful Request

### Request

```http
GET /api/weather/london
```

### Response

```json
{
  "tempC": 18,
  "condition": "cloudy"
}
```

Another available city:

```http
GET /api/weather/lagos
```

Response:

```json
{
  "tempC": 30,
  "condition": "sunny"
}
```

---

## ❌ Error Response

If a city does not exist in the mock data:

```http
GET /api/weather/paris
```

The API returns:

```http
404 Not Found
```

with:

```json
{
  "error": "City not found"
}
```

---

## 🧠 Key Concepts

### 1. Express Application

The project uses Express to create the HTTP server:

```javascript
const express = require("express");

const app = express();
```

Express provides the tools needed to define routes and handle incoming HTTP requests.

---

### 2. GET Route

The API endpoint is defined using:

```javascript
app.get("/api/weather/:city", (req, res) => {
  // ...
});
```

This tells Express to execute the route handler whenever a client sends a `GET` request matching the specified path.

---

### 3. URL Parameters

The `:city` section is a dynamic URL parameter.

Express makes it available through:

```javascript
req.params.city
```

For example:

```http
GET /api/weather/Lagos
```

gives:

```javascript
req.params.city
```

the value:

```text
Lagos
```

The project converts it to lowercase so that requests such as `Lagos`, `LAGOS`, and `lagos` can match the same data entry.

---

### 4. JSON Responses

The API returns weather information using:

```javascript
res.json(weatherData[city]);
```

Express converts the JavaScript object into a JSON response that the client can consume.

---

### 5. HTTP Status Codes

The project demonstrates successful responses and error responses.

#### Successful Request

A valid city returns the weather data with the default successful HTTP response.

#### Not Found

An unknown city returns:

```javascript
res.status(404).json({
  error: "City not found"
});
```

The `404` status communicates that the requested resource could not be found.

---

## 📦 Technologies

* **Node.js**
* **Express.js**
* **JavaScript**
* **HTTP**
* **JSON**

---

## 🚀 Getting Started

### Prerequisites

Make sure you have Node.js and npm installed.

Check your installation:

```bash
node -v
npm -v
```

### 1. Clone the Repository

```bash
git clone <repository-url>
```

### 2. Navigate to the Project

```bash
cd project-01
```

### 3. Install Dependencies

```bash
npm install
```

### 4. Start the Server

```bash
node index.js
```

The API will run on:

```text
http://localhost:3000
```

You should see:

```text
API running on http://localhost:3000
```

---

## 🧪 Testing the API

You can test the API using:

* Browser
* Postman
* cURL
* Thunder Client
* VS Code REST Client

### Browser

Open:

```text
http://localhost:3000/api/weather/london
```

### cURL

```bash
curl http://localhost:3000/api/weather/london
```

Test an unavailable city:

```bash
curl http://localhost:3000/api/weather/paris
```

---

## 📁 Project Structure

```text
project-01/
│
├── index.js
├── package.json
└── README.md
```

### `index.js`

Contains the Express application, mock weather data, API route, error handling, and server configuration.

### `package.json`

Contains the project's Node.js configuration and dependencies.

### `README.md`

Contains the documentation for the project and the concepts demonstrated.

---

## 🏛️ Architecture

This project intentionally uses a very simple architecture:

```text
             ┌──────────────┐
             │    Client    │
             └──────┬───────┘
                    │
                    │ HTTP GET
                    ▼
             ┌──────────────┐
             │   Express    │
             │     API      │
             └──────┬───────┘
                    │
                    ▼
             ┌──────────────┐
             │ Route Handler│
             └──────┬───────┘
                    │
                    ▼
             ┌──────────────┐
             │ Mock Weather │
             │     Data     │
             └──────────────┘
```

There is intentionally no database, authentication system, cache, or external weather service.

The purpose of this blueprint is to isolate the **fundamentals of API communication**.

---

## 💡 Possible Improvements

Once the fundamentals are understood, this API could be extended with:

* A real weather API
* PostgreSQL or MongoDB
* Input validation
* Centralized error handling
* Authentication
* Rate limiting
* Request logging
* Environment variables
* Automated tests
* API documentation
* Caching

These improvements introduce concepts explored throughout the other blueprints in this repository.

---

## 🎓 Learning Outcome

After completing this project, you should understand the basic flow of an HTTP API:

```text
Client
  ↓
HTTP Request
  ↓
API Route
  ↓
Backend Logic
  ↓
JSON Response
  ↓
Client
```

You should also be able to explain:

* What an API is
* What an API endpoint is
* How HTTP `GET` requests work
* How URL parameters work
* How Express handles requests
* How JSON responses are returned
* Why HTTP status codes matter
* How a backend communicates with a client

---

## 🔗 Blueprint Information

**Series:** Backend System Design — 40 Project Blueprints

**Project:** 01 / 40

**Concept:** API Fundamentals

**Focus:** Understanding how clients communicate with backend services through HTTP APIs.

---

## 👨‍💻 Creator

**Andrew Emaye**

This project is part of my practical journey through backend development and system design, focusing on understanding the fundamental architectures and patterns used to build scalable applications.

---

## 🔒 Privacy Policy

This project is a local educational backend application and does not intentionally collect, store, sell, or share personal user information.

The weather data used by this project is **mock data stored directly in the application**. No external user database or personal information collection is implemented.

If this project is later extended with third-party services, databases, authentication, analytics, or other data-collecting features, the privacy policy should be updated accordingly.

---

## 📄 License

This project is licensed under the **MIT License**.

You are free to use, copy, modify, merge, publish, distribute, sublicense, and sell copies of the project, subject to the conditions of the MIT License.

See the `LICENSE` file in this repository for the full license text.

---

## ⭐ Support

If you're learning backend development and system design, feel free to explore the other blueprints in this repository.

**Build it. Break it. Understand it. Scale it.**
