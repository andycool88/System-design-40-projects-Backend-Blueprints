# Project 09 — Rate Limiting vs Throttling

A practical Express.js project demonstrating two important techniques for controlling incoming traffic to a backend application: **rate limiting** and **throttling**.

This project implements a rate-limited endpoint that restricts the number of requests a client can make within a specific time window, alongside a throttled endpoint that intentionally delays responses to control traffic behavior.

This is the ninth blueprint in the **Backend System Design — 40 Project Blueprints** series.

---

# 🎯 What This Project Teaches

This project focuses on two important traffic-control concepts:

* Rate limiting
* Throttling
* Request limits
* Time windows
* Express middleware
* Traffic control
* API protection
* `429 Too Many Requests`
* Response delays
* Protecting backend resources
* Controlling excessive traffic

The key goal is to understand:

> **Rate limiting controls how many requests a client can make, while throttling controls the rate or speed at which requests are processed or responses are delivered.**

---

# 🚦 Rate Limiting vs Throttling

Although rate limiting and throttling are closely related, they solve different problems.

### Rate Limiting

Rate limiting restricts the number of requests allowed within a defined period.

This project allows:

```text
5 requests
     ↓
1 minute
```

Once the limit is exceeded:

```text
Too Many Requests
        ↓
       429
```

Conceptually:

```text
Client
  │
  ├── Request 1 → Allow
  ├── Request 2 → Allow
  ├── Request 3 → Allow
  ├── Request 4 → Allow
  ├── Request 5 → Allow
  │
  └── Request 6 → Reject
                    ↓
                   429
```

---

### Throttling

Throttling controls the rate at which traffic is handled.

In this project, the throttled endpoint deliberately delays the response by:

```text
2 seconds
```

The flow becomes:

```text
Request
   ↓
Throttle
   ↓
Wait 2 seconds
   ↓
Response
```

---

# 🏗️ Architecture

```text
                           Client
                             │
                ┌────────────┴────────────┐
                │                         │
                ▼                         ▼
        /rate-limited                 /throttled
                │                         │
                ▼                         ▼
         Rate Limiter                 Throttle
                │                         │
          ┌─────┴─────┐                   │
          │           │                   ▼
       Under Limit  Over Limit        2 Second Delay
          │           │                   │
          ▼           ▼                   ▼
        Allow        429               Response
          │
          ▼
       Response
```

---

# 📡 API Endpoints

| Method | Endpoint        | Protection   | Purpose                        |
| ------ | --------------- | ------------ | ------------------------------ |
| `GET`  | `/rate-limited` | Rate Limiter | Limit requests to 5 per minute |
| `GET`  | `/throttled`    | Throttle     | Delay response by 2 seconds    |

---

# 1. Rate Limiting

The first part of the project demonstrates rate limiting using:

```javascript
const rateLimit = require("express-rate-limit");
```

The limiter is configured as:

```javascript
const limiter = rateLimit({
  windowMs: 60 * 1000,
  max: 5,
  message: {
    error: "Too many requests, try again later"
  }
});
```

There are three important settings.

---

## ⏱️ `windowMs`

```javascript
windowMs: 60 * 1000
```

This represents the length of the rate-limiting window.

The calculation is:

```text
60 seconds × 1000 milliseconds
       ↓
60,000 milliseconds
       ↓
1 minute
```

Therefore, the limit applies within a one-minute window.

---

## 🔢 `max`

```javascript
max: 5
```

This specifies that a client can make a maximum of:

```text
5 requests
```

within the configured window.

The basic rule is:

```text
5 requests / minute
```

---

## ❌ Limit Message

When the request limit is exceeded, the configured message is returned:

```javascript
message: {
  error: "Too many requests, try again later"
}
```

The client is informed that it has exceeded the allowed request rate.

---

# 2. Applying the Rate Limiter

The limiter is applied to:

```javascript
app.get("/rate-limited", limiter, (req, res) => {
```

This means the request must pass through the limiter before reaching the route handler.

The middleware flow is:

```text
Request
   ↓
Rate Limiter
   ↓
Check Request Count
   │
   ├── Within Limit → Route Handler
   │
   └── Over Limit → Reject
```

This demonstrates an important Express concept:

> **Middleware can inspect and control requests before they reach the route handler.**

---

# ✅ Request Within Rate Limit

When the client has not exceeded the limit, the request reaches:

```javascript
res.json({
  message: "You passed the rate limit check"
});
```

The response is:

```json
{
  "message": "You passed the rate limit check"
}
```

The flow is:

```text
Client
   ↓
Request
   ↓
Rate Limiter
   ↓
Under 5 Requests
   ↓
Allow
   ↓
JSON Response
```

---

# ❌ Request Exceeding Rate Limit

Once the client exceeds the configured limit:

```text
5 requests
   ↓
Allowed
   ↓
6th request
   ↓
Rejected
```

The client receives the configured error:

```json
{
  "error": "Too many requests, try again later"
}
```

The appropriate HTTP response for rate-limit rejection is:

```text
429 Too Many Requests
```

---

# 🚫 Understanding 429 Too Many Requests

HTTP status code `429` indicates that the client has sent too many requests within a given period.

Conceptually:

```text
Client
   ↓
Too Many Requests
   ↓
429
```

This is particularly useful for protecting APIs from excessive traffic.

Common situations include:

```text
Too many API requests
Too many login attempts
Too many password-reset attempts
Too many search requests
Too many payment requests
```

---

# 3. Throttling

The second part of the project demonstrates a simple form of throttling.

The endpoint is:

```http
GET /throttled
```

The implementation uses:

```javascript
setTimeout(() => {
  res.json({
    message: "Response delayed to throttle traffic"
  });
}, 2000);
```

The server waits:

```text
2000 milliseconds
       ↓
2 seconds
```

before sending the response.

---

# ⏳ Understanding the Throttle

The request flow is:

```text
Client
   │
   ▼
GET /throttled
   │
   ▼
Server receives request
   │
   ▼
Wait 2 seconds
   │
   ▼
Send response
```

The response is:

```json
{
  "message": "Response delayed to throttle traffic"
}
```

---

# ⚖️ Rate Limiting vs Throttling

| Concept                    | Rate Limiting             | Throttling                      |
| -------------------------- | ------------------------- | ------------------------------- |
| Main purpose               | Restrict request count    | Control request processing rate |
| Project implementation     | Maximum 5 requests/minute | 2-second response delay         |
| Middleware                 | `express-rate-limit`      | `setTimeout()`                  |
| Result when limit exceeded | Request rejected          | Request delayed                 |
| Example                    | `5 requests/minute`       | `2 second delay`                |
| Common purpose             | Prevent excessive traffic | Control traffic speed           |

The important distinction is:

```text
Rate Limiting
     ↓
"How many requests are allowed?"

Throttling
     ↓
"How quickly should traffic be handled?"
```

---

# 🔄 Complete Traffic-Control Flow

```text
                              Client
                                │
                  ┌─────────────┴─────────────┐
                  │                           │
                  ▼                           ▼
           Rate-Limited                  Throttled
               Route                       Route
                  │                           │
                  ▼                           ▼
           Count Requests              Delay Request
                  │                           │
           ┌──────┴──────┐                    │
           │             │                    ▼
       Under Limit    Over Limit          2 Seconds
           │             │                    │
           ▼             ▼                    ▼
         Allow          429               Response
           │
           ▼
        Response
```

---

# 🧠 Key Concepts

## 1. Request Limiting

Rate limiting prevents a client from making unlimited requests within a specified period.

This project uses:

```text
5 requests
    ↓
1 minute
```

This can help protect backend services from excessive traffic.

---

## 2. Time Windows

The rate limiter uses:

```javascript
windowMs: 60 * 1000
```

This creates a one-minute rate-limiting window.

Conceptually:

```text
Minute
│
├── Request 1
├── Request 2
├── Request 3
├── Request 4
├── Request 5
│
└── Additional requests → Limited
```

---

## 3. Middleware

The rate limiter is Express middleware:

```javascript
limiter
```

It is placed between the incoming request and route handler:

```text
Request
   ↓
Middleware
   ↓
Route Handler
   ↓
Response
```

This is one of the most important patterns in Express applications.

---

## 4. Traffic Protection

Rate limiting can help protect backend services from:

* Accidental request loops
* Excessive API usage
* Brute-force attempts
* Automated clients
* Traffic spikes
* Resource exhaustion

However, rate limiting is only one part of a broader backend security strategy.

---

## 5. Response Delays

The throttled endpoint uses:

```javascript
setTimeout()
```

to delay the response.

```text
Request
   ↓
2 Second Delay
   ↓
Response
```

This project uses the delay to demonstrate the basic idea of throttling.

In production systems, throttling can be implemented in more sophisticated ways depending on the architecture and traffic requirements.

---

# 🛡️ Why Rate Limiting Matters

Without rate limiting, a client could potentially send requests continuously:

```text
Client
 ↓
Request
 ↓
Request
 ↓
Request
 ↓
Request
 ↓
Request
 ↓
Request
 ↓
...
```

This can place unnecessary pressure on backend resources.

With rate limiting:

```text
Client
 ↓
Request
 ↓
Limiter
 ↓
Check Usage
 ↓
Allow / Reject
```

The backend gains a mechanism for controlling excessive traffic.

---

# 🌍 Real-World Examples

Rate limiting can be useful for:

### Login APIs

```text
5 login attempts
     ↓
Within a time window
     ↓
Further attempts blocked
```

This can reduce automated password-guessing attempts.

### Public APIs

```text
Client
   ↓
API
   ↓
100 requests/minute
```

Requests beyond the configured limit can be rejected.

### Password Reset

```text
Email
   ↓
Password Reset Request
   ↓
Rate Limit
```

This can help prevent abuse of password-reset endpoints.

### Payment APIs

Sensitive operations can use carefully designed rate limits to reduce accidental or malicious repeated requests.

---

# 🚨 Important Security Note

The rate limiter in this project is intentionally simple for educational purposes.

A production application should consider:

* Appropriate limits for each endpoint
* Different limits for authenticated and unauthenticated users
* IP-based limits
* User/account-based limits
* API-key-based limits
* Distributed rate limiting
* Reverse proxies
* Redis-backed counters where appropriate
* Monitoring
* Logging
* Alerting
* Appropriate `429` responses
* `Retry-After` information where appropriate

The throttling implementation is also intentionally simplified:

```javascript
setTimeout()
```

A simple two-second delay is useful for understanding the concept, but it should not be treated as a complete production throttling architecture.

In distributed systems, traffic control may require coordination between multiple application instances and shared infrastructure.

---

# 📦 Technologies

* **Node.js**
* **Express.js**
* **JavaScript**
* **express-rate-limit**
* **HTTP**
* **JSON**
* **Rate Limiting**
* **Throttling**
* **Express Middleware**

---

# 🚀 Getting Started

## Prerequisites

Make sure Node.js and npm are installed:

```bash
node -v
npm -v
```

---

## 1. Install Dependencies

From the project directory:

```bash
npm install
```

The required packages include:

```bash
npm install express express-rate-limit
```

---

## 2. Start the Server

```bash
node index.js
```

The server will run on:

```text
http://localhost:9200
```

You should see:

```text
Rate/Throttle API running on port 9200
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

# Test Rate Limiting

## 1. Send a Request

```bash
curl http://localhost:9200/rate-limited
```

Expected response:

```json
{
  "message": "You passed the rate limit check"
}
```

---

## 2. Send Multiple Requests

The endpoint allows a maximum of:

```text
5 requests per minute
```

You can test this with:

```bash
for i in {1..6}; do
  curl http://localhost:9200/rate-limited
  echo
done
```

The first five requests should pass through the limiter.

The next request should be rejected once the configured limit has been reached.

Expected error:

```json
{
  "error": "Too many requests, try again later"
}
```

The relevant HTTP status is:

```text
429 Too Many Requests
```

---

# Test Throttling

## 1. Send a Throttled Request

```bash
curl http://localhost:9200/throttled
```

The server intentionally waits approximately:

```text
2 seconds
```

before returning:

```json
{
  "message": "Response delayed to throttle traffic"
}
```

You can observe the delay using:

```bash
time curl http://localhost:9200/throttled
```

The command should take approximately two seconds to complete.

---

# 📁 Project Structure

```text
project-09/
│
├── index.js
├── package.json
└── README.md
```

### `index.js`

Contains the Express application, rate limiter configuration, rate-limited endpoint, throttled endpoint, and server configuration.

### `package.json`

Contains the Node.js project configuration and dependencies.

### `README.md`

Contains the documentation for the project and the traffic-control concepts demonstrated.

---

# 💡 Possible Improvements

This project intentionally uses simple implementations to isolate the concepts of rate limiting and throttling.

Possible improvements include:

* Apply rate limiting globally
* Create different limits for different routes
* Add authentication-aware rate limits
* Add user-based rate limiting
* Add API-key-based limits
* Use Redis for distributed rate limiting
* Add `Retry-After` headers
* Add request logging
* Add monitoring
* Add rate-limit analytics
* Add IP allowlists and blocklists
* Add automated tests
* Add configurable limits through environment variables
* Implement a token-bucket algorithm
* Implement a leaky-bucket algorithm
* Implement a sliding-window algorithm
* Add a reverse proxy such as Nginx
* Add distributed traffic management

A more scalable architecture could look like:

```text
                         Client
                           │
                           ▼
                     Load Balancer
                           │
                           ▼
                    API Gateway
                           │
                           ▼
                  Rate Limit Service
                           │
                           ▼
                        Redis
                           │
                           ▼
                  Application Server
                    │          │
                    ▼          ▼
                 Service A   Service B
                    │          │
                    └────┬─────┘
                         ▼
                       APIs
```

In a distributed application, a shared store such as Redis can allow multiple application instances to coordinate rate limits.

---

# 🎓 Learning Outcome

After completing this project, you should be able to explain:

* What rate limiting means
* What throttling means
* The difference between rate limiting and throttling
* How Express middleware can control incoming requests
* What a rate-limit window is
* How `windowMs` works
* How the `max` request limit works
* Why APIs return `429 Too Many Requests`
* How rate limiting protects backend resources
* How response delays demonstrate basic throttling
* Why production throttling is more complex than `setTimeout()`
* How Redis can support distributed rate limiting
* How traffic-control mechanisms fit into backend architecture

The key lesson is:

> **Rate limiting controls how many requests are allowed, while throttling controls the rate at which traffic is processed.**

---

# 🔗 Blueprint Information

**Series:** Backend System Design — 40 Project Blueprints

**Project:** 09 / 40

**Concept:** Rate Limiting vs Throttling

**Focus:** Understanding how backend applications control excessive traffic, protect resources, and manage request rates.

---

# 👨‍💻 Creator

**Andrew Emaye**

This project is part of my practical backend development and system-design learning series, focused on understanding the architectures, patterns, and building blocks used to create scalable applications.

---

# 🔒 Privacy Policy

This project is an educational backend application and does not intentionally collect, sell, or share personal user information.

The application does not intentionally store personal user information as part of the rate-limiting and throttling demonstrations.

Request traffic used during testing is processed only to demonstrate backend traffic-control concepts.

If this project is extended to process real user information, appropriate privacy, security, authentication, and data-protection measures should be implemented.

---

# 📄 License

This project is licensed under the **MIT License**.

You are free to use, copy, modify, merge, publish, distribute, sublicense, and sell copies of the project, subject to the conditions of the MIT License.

See the `LICENSE` file in this repository for the full license text.

---

## ⭐ Keep Learning

**Build it. Break it. Understand it. Scale it.**
