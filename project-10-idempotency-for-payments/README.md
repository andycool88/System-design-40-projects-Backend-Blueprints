# Project 10 — Idempotency in Payment APIs

A practical Express.js project demonstrating **idempotency**, an important backend concept used to prevent duplicate operations when the same request is submitted multiple times.

This project simulates a payment API where an **idempotency key** is used to ensure that retrying the same payment request does not create a second transaction.

This is the tenth blueprint in the **Backend System Design — 40 Project Blueprints** series.

---

# 🎯 What This Project Teaches

This project focuses on an important concept in reliable backend systems:

* Idempotency
* Idempotency keys
* Duplicate requests
* Payment processing
* Request retries
* Transaction safety
* API reliability
* HTTP request headers
* Preventing duplicate payments
* Reusing previous results
* In-memory request tracking

The key goal is to understand:

> **Idempotency allows a client to safely retry the same operation without accidentally performing that operation more than once.**

---

# 💳 Understanding Idempotency

Imagine a customer makes a payment.

The client sends:

```text
POST /pay
```

The server processes the payment successfully.

But then something goes wrong.

Perhaps:

```text
Payment processed
       ↓
Server sends response
       ↓
Network failure
       ↓
Client does not receive response
```

The client may assume the payment failed and retry the request.

Without idempotency:

```text
Request 1
   ↓
Charge ₦10,000
   ↓
Network Failure
   ↓
Retry
   ↓
Charge ₦10,000 AGAIN
```

The customer could be charged twice.

With idempotency:

```text
Request 1
   ↓
Idempotency Key
   ↓
Process Payment
   ↓
Save Result
   ↓
Network Failure
   ↓
Retry Same Key
   ↓
Find Existing Result
   ↓
Return Previous Result
```

The payment is processed only once.

---

# 🔑 What Is an Idempotency Key?

An idempotency key is a unique value supplied by the client to identify a particular operation.

This project reads the key from:

```http
Idempotency-Key: payment-123
```

The server then uses that key to determine whether the operation has already been processed.

Conceptually:

```text
Idempotency-Key
       ↓
"payment-123"
       ↓
Have we processed this before?
       │
   ┌───┴────┐
   │        │
  No       Yes
   │        │
   ▼        ▼
Process   Return
Payment   Previous Result
```

---

# 🏗️ Architecture

```text
                              Client
                                │
                                │
                                ▼
                         POST /pay
                                │
                                ▼
                     Idempotency-Key
                                │
                                ▼
                       Check Stored Keys
                                │
                     ┌──────────┴──────────┐
                     │                     │
                  New Key              Existing Key
                     │                     │
                     ▼                     ▼
              Process Payment       Return Previous
                     │                   Result
                     ▼
              Generate Result
                     │
                     ▼
              Store Result
                     │
                     ▼
                Send Response
```

---

# 📡 API Endpoint

| Method | Endpoint | Purpose                                              |
| ------ | -------- | ---------------------------------------------------- |
| `POST` | `/pay`   | Process a simulated payment using an idempotency key |

---

# 1. Payment Request

The payment endpoint is:

```http
POST /pay
```

The client sends an idempotency key through the request headers.

For example:

```http
Idempotency-Key: payment-123
```

The server extracts the key:

```javascript
const key = req.headers["idempotency-key"];
```

This gives the server a way to identify repeated requests.

---

# 2. Checking for Duplicate Requests

The project maintains an in-memory store:

```javascript
const processedRequests = {};
```

The object stores previously processed requests.

The server checks:

```javascript
if (processedRequests[key]) {
```

This asks:

> **Have we already processed a request using this idempotency key?**

---

# ✅ New Request

If the key has never been used before:

```text
Idempotency Key
       ↓
Not Found
       ↓
Process Payment
```

The project simulates the payment:

```javascript
const result = {
  status: "success",
  transactionId: Date.now()
};
```

The result contains:

```text
status
transactionId
```

For example:

```json
{
  "status": "success",
  "transactionId": 1750000000000
}
```

---

# 💾 Storing the Result

After processing the payment, the result is stored using the idempotency key:

```javascript
processedRequests[key] = result;
```

Conceptually:

```text
processedRequests

{
  "payment-123": {
    status: "success",
    transactionId: 1750000000000
  }
}
```

The key becomes associated with the result of the original operation.

---

# 🔁 Retrying the Same Payment

Suppose the client sends:

```http
Idempotency-Key: payment-123
```

again.

The server checks:

```javascript
processedRequests[key]
```

This time, the result already exists.

Therefore, the payment is **not processed again**.

Instead, the server returns:

```javascript
return res.json({
  message: "Payment already processed",
  result: processedRequests[key]
});
```

The response might look like:

```json
{
  "message": "Payment already processed",
  "result": {
    "status": "success",
    "transactionId": 1750000000000
  }
}
```

Notice that the transaction ID remains the same.

---

# 🛡️ Preventing Duplicate Charges

Without idempotency:

```text
Client
   │
   ├── Payment Request
   │       ↓
   │    Charge
   │
   └── Retry
           ↓
         Charge AGAIN
```

With idempotency:

```text
Client
   │
   ├── Payment Request
   │       ↓
   │    Charge
   │       ↓
   │    Save Result
   │
   └── Retry
           ↓
      Same Key
           ↓
    Return Previous Result
```

This is particularly important for financial operations.

---

# 🔄 Complete Payment Flow

```text
                         Client
                           │
                           ▼
                       POST /pay
                           │
                           ▼
                  Idempotency-Key
                           │
                           ▼
                 Check Request Store
                           │
                    ┌──────┴──────┐
                    │             │
                 New Key       Existing Key
                    │             │
                    ▼             ▼
             Process Payment   Return Stored
                    │             Result
                    ▼
              Generate Result
                    │
                    ▼
             Store Result
                    │
                    ▼
                 Response
```

---

# 🧠 Key Concepts

## 1. Idempotency

Idempotency means that performing the same operation multiple times with the same identifier does not produce multiple unintended effects.

For this project:

```text
Same Key
   ↓
Same Payment Operation
   ↓
One Payment Result
```

The first request performs the operation.

Subsequent requests with the same key return the existing result.

---

## 2. Idempotency Key

The idempotency key identifies a particular operation.

Example:

```text
payment-123
```

Another payment should use a different key:

```text
payment-456
```

Therefore:

```text
payment-123 → Payment A
payment-456 → Payment B
```

The key should represent one logical operation.

---

## 3. Request Retries

Retries are common in distributed systems.

A client may retry because of:

* Network failures
* Timeouts
* Connection interruptions
* Temporary server errors
* Load balancer issues
* Mobile network instability

For example:

```text
Client
   ↓
Request
   ↓
Server processes payment
   ↓
Network timeout
   ↓
Client retries
```

The server must be able to distinguish:

```text
New Payment
```

from:

```text
Retry of Existing Payment
```

The idempotency key provides that distinction.

---

# 🌐 Why Idempotency Matters in Distributed Systems

Distributed systems are unreliable by nature.

A request can succeed even when the client does not receive the response.

For example:

```text
             Client
                │
                │ Payment
                ▼
             Server
                │
                ▼
         Payment Processed
                │
                │ Response
                ▼
           Network Failure
                X
                │
                ▼
       Client receives nothing
```

The client cannot know with certainty whether the payment succeeded.

It may retry.

That creates the possibility of duplicate processing.

Idempotency solves this problem by allowing the server to recognize the retry.

---

# 💰 Real-World Payment Example

Imagine a customer submits:

```text
Pay ₦50,000
```

The client generates:

```text
Idempotency-Key:
payment-8f73a92
```

The server receives:

```text
payment-8f73a92
```

and processes the transaction.

The result is stored:

```text
payment-8f73a92
        ↓
Transaction #ABC123
```

If the client retries:

```text
payment-8f73a92
```

the server sees that the operation already exists:

```text
payment-8f73a92
        ↓
Already Processed
        ↓
Return Transaction #ABC123
```

The customer is not charged again.

---

# ⚖️ Idempotent vs Non-Idempotent Operations

Understanding which operations need idempotency is important.

### Potentially dangerous operation

```text
POST /pay
```

Repeated execution could create multiple payments.

```text
Request 1 → Payment
Request 2 → Another Payment
```

### Idempotent design

```text
POST /pay
Idempotency-Key: payment-123
```

Repeated execution:

```text
Request 1 → Payment
Request 2 → Same Result
Request 3 → Same Result
```

---

# 📊 Request Comparison

| Request        | Idempotency Key | Result                   |
| -------------- | --------------- | ------------------------ |
| First request  | `payment-123`   | Payment processed        |
| Second request | `payment-123`   | Existing result returned |
| Third request  | `payment-123`   | Existing result returned |
| New payment    | `payment-456`   | New payment processed    |

The key determines whether the request represents an existing operation or a new one.

---

# 🚨 Important Security and Reliability Note

The implementation in this project is intentionally simplified for educational purposes.

The request store is:

```javascript
const processedRequests = {};
```

This means the idempotency records exist only in the memory of the current Node.js process.

That creates several limitations.

### Application Restart

If the server restarts:

```text
Server
   ↓
Restart
   ↓
Memory Cleared
   ↓
Idempotency Records Lost
```

The server would no longer know which requests were previously processed.

---

### Multiple Server Instances

Suppose the application has two servers:

```text
             Load Balancer
                │
        ┌───────┴───────┐
        │               │
     Server A        Server B
        │               │
    Memory A         Memory B
```

A request could reach Server A:

```text
payment-123
     ↓
Server A
     ↓
Processed
```

A retry could reach Server B:

```text
payment-123
     ↓
Server B
     ↓
Not Found
     ↓
Process Again
```

This could result in duplicate processing.

A production system therefore needs a **shared, durable idempotency store**.

Possible choices include:

* PostgreSQL
* MySQL
* Redis
* DynamoDB
* Other transactional data stores

The appropriate choice depends on the architecture and consistency requirements.

---

# 🔒 Production Idempotency Design

A more realistic payment architecture might look like:

```text
                           Client
                             │
                             ▼
                         POST /pay
                             │
                             ▼
                    Idempotency-Key
                             │
                             ▼
                       API Gateway
                             │
                             ▼
                   Payment Service
                             │
                             ▼
                  Idempotency Store
                         Redis/DB
                             │
                  ┌──────────┴──────────┐
                  │                     │
               New Key              Existing Key
                  │                     │
                  ▼                     ▼
          Process Payment         Return Stored
                  │                   Result
                  ▼
           Store Transaction
                  │
                  ▼
              Response
```

The important difference is that the idempotency state is shared and persistent rather than stored inside one Node.js process.

---

# 📦 Technologies

* **Node.js**
* **Express.js**
* **JavaScript**
* **HTTP**
* **JSON**
* **HTTP Headers**
* **Idempotency**
* **Payment API Concepts**

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

The project requires:

```bash
npm install express
```

---

## 2. Start the Server

```bash
node index.js
```

The server will run on:

```text
http://localhost:9300
```

You should see:

```text
Idempotency API running on port 9300
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

# Test Idempotency

## 1. First Payment Request

Send a payment request with an idempotency key:

```bash
curl -X POST http://localhost:9300/pay \
-H "Idempotency-Key: payment-123"
```

Expected response:

```json
{
  "message": "Payment processed",
  "result": {
    "status": "success",
    "transactionId": 1750000000000
  }
}
```

The exact `transactionId` will be different because the project generates it using:

```javascript
Date.now()
```

---

## 2. Retry the Same Payment

Send the exact same request again:

```bash
curl -X POST http://localhost:9300/pay \
-H "Idempotency-Key: payment-123"
```

This time, the server should return:

```json
{
  "message": "Payment already processed",
  "result": {
    "status": "success",
    "transactionId": 1750000000000
  }
}
```

Notice that the transaction ID remains the same.

This demonstrates that the payment was not processed a second time.

---

# 3. Create a New Payment

Use a different idempotency key:

```bash
curl -X POST http://localhost:9300/pay \
-H "Idempotency-Key: payment-456"
```

Because this is a new key, the server processes a new payment.

Expected:

```json
{
  "message": "Payment processed",
  "result": {
    "status": "success",
    "transactionId": 1750000001000
  }
}
```

The transaction ID will be different from the first payment.

---

# 🔬 Testing the Concept

You can visualize the test like this:

```text
Request 1
Key: payment-123
        ↓
    Process
        ↓
 Transaction A


Request 2
Key: payment-123
        ↓
 Already Exists
        ↓
 Return Transaction A


Request 3
Key: payment-456
        ↓
     New Key
        ↓
    Process
        ↓
 Transaction B
```

The key difference is:

```text
Same Key
   ↓
Same Operation

Different Key
   ↓
New Operation
```

---

# 📁 Project Structure

```text
project-10/
│
├── index.js
├── package.json
└── README.md
```

### `index.js`

Contains the Express application, in-memory idempotency store, payment simulation route, duplicate-request detection, and server configuration.

### `package.json`

Contains the Node.js project configuration and dependencies.

### `README.md`

Contains the documentation for the project and the idempotency concepts demonstrated.

---

# 💡 Possible Improvements

This project intentionally uses an in-memory object to make the core idempotency concept easy to understand.

Possible improvements include:

* Store idempotency keys in PostgreSQL
* Store idempotency keys in Redis
* Store transaction records in a database
* Add unique database constraints
* Add idempotency-key expiration
* Add request status tracking
* Store request hashes
* Detect conflicting requests using the same key
* Add transaction states such as `pending`, `success`, and `failed`
* Add database transactions
* Add payment-provider integration
* Add distributed locking where appropriate
* Add authentication
* Add authorization
* Add rate limiting
* Add structured logging
* Add automated tests
* Add monitoring
* Add retry handling
* Add webhook processing
* Add reconciliation mechanisms

A more advanced payment architecture could look like:

```text
                              Client
                                │
                                ▼
                           POST /pay
                                │
                                ▼
                       Idempotency Key
                                │
                                ▼
                          API Gateway
                                │
                                ▼
                       Payment Service
                                │
                       ┌────────┴────────┐
                       │                 │
                       ▼                 ▼
                Idempotency Store   Transaction DB
                       │                 │
                       └────────┬────────┘
                                │
                                ▼
                       Payment Provider
                                │
                                ▼
                         Payment Result
                                │
                                ▼
                       Store Final Result
                                │
                                ▼
                             Client
```

---

# 🎓 Learning Outcome

After completing this project, you should be able to explain:

* What idempotency means
* What an idempotency key is
* Why payment APIs need idempotency
* How duplicate requests happen
* Why network failures can cause retries
* How an idempotency key prevents duplicate processing
* How an API can return a previously stored result
* Why an in-memory idempotency store is limited
* Why distributed applications need shared idempotency storage
* How Redis or a database can be used for idempotency
* How idempotency fits into payment-system architecture
* Why idempotency is important for reliable distributed systems

The key lesson is:

> **A reliable payment API must be able to distinguish a new operation from a retry of an operation that has already been processed. Idempotency keys provide that mechanism.**

---

# 🔗 Blueprint Information

**Series:** Backend System Design — 40 Project Blueprints

**Project:** 10 / 40

**Concept:** Idempotency

**Focus:** Understanding how backend systems prevent duplicate operations and safely handle retries, especially in payment APIs.

---

# 👨‍💻 Creator

**Andrew Emaye**

This project is part of my practical backend development and system-design learning series, focused on understanding the architectures, patterns, and building blocks used to create scalable applications.

---

# 🔒 Privacy Policy

This project is an educational backend application and does not intentionally collect, sell, or share personal user information.

The payment transactions demonstrated by this project are simulated and do not represent real financial transactions.

No real payment card information, banking information, or financial account information is intentionally collected or processed by this application.

If this project is extended to process real payment or user information, appropriate privacy, security, authentication, financial-data protection, and compliance measures should be implemented.

---

# 📄 License

This project is licensed under the **MIT License**.

You are free to use, copy, modify, merge, publish, distribute, sublicense, and sell copies of the project, subject to the conditions of the MIT License.

See the `LICENSE` file in this repository for the full license text.

---

## ⭐ Keep Learning

**Build it. Break it. Understand it. Scale it.**
