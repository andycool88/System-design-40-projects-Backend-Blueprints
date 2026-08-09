# Project 03 — HTTP Methods & CRUD API

A practical Express.js CRUD API demonstrating the fundamental **HTTP methods** used to create, retrieve, update, and delete resources.

This project uses a simple in-memory collection of books to demonstrate how `GET`, `POST`, `PUT`, `PATCH`, and `DELETE` requests work in a REST API.

This is the third blueprint in the **Backend System Design — 40 Project Blueprints** series.

---

## 🎯 What This Project Teaches

This project focuses on the core HTTP methods used when building REST APIs:

* `GET` — Retrieve resources
* `POST` — Create resources
* `PUT` — Completely replace a resource
* `PATCH` — Partially update a resource
* `DELETE` — Remove a resource
* URL parameters
* JSON request bodies
* HTTP status codes
* Request validation
* CRUD operations
* Express route handlers

The goal is to understand how different HTTP methods represent different operations on backend resources.

---

# 🔄 CRUD Operations

CRUD stands for:

| Operation         | HTTP Method | Endpoint     |
| ----------------- | ----------- | ------------ |
| Create            | `POST`      | `/books`     |
| Read all          | `GET`       | `/books`     |
| Read one          | `GET`       | `/books/:id` |
| Update completely | `PUT`       | `/books/:id` |
| Update partially  | `PATCH`     | `/books/:id` |
| Delete            | `DELETE`    | `/books/:id` |

The project uses books as the resource being managed.

---

# 🏗️ Architecture

```text
                Client
                  │
                  │ HTTP Request
                  ▼
          ┌─────────────────┐
          │  Express Server │
          └────────┬────────┘
                   │
                   ▼
            Route Handler
                   │
                   ▼
             Books Array
                   │
        ┌──────────┼──────────┐
        │          │          │
       GET       POST      PUT/PATCH
        │          │          │
        └──────────┼──────────┘
                   │
                   ▼
              JSON Response
```

There is intentionally no database in this project.

The books are stored in an array in server memory so that the focus remains on understanding **HTTP methods and CRUD behavior**.

---

# 📡 API Endpoints

## 1. Get All Books

```http
GET /books
```

Returns every book currently stored in the application.

### Example Request

```bash
curl http://localhost:3003/books
```

### Example Response

```json
[
  {
    "id": 1,
    "title": "Node.js Basics",
    "author": "Andrew"
  },
  {
    "id": 2,
    "title": "Learning Express",
    "author": "John"
  }
]
```

### Status Code

```text
200 OK
```

---

# 2. Get a Single Book

```http
GET /books/:id
```

The `:id` parameter identifies the book that should be retrieved.

### Example

```bash
curl http://localhost:3003/books/1
```

### Response

```json
{
  "id": 1,
  "title": "Node.js Basics",
  "author": "Andrew"
}
```

### If the Book Doesn't Exist

```json
{
  "message": "Book not found"
}
```

Status:

```text
404 Not Found
```

---

# 3. Create a Book

```http
POST /books
```

Creates a new book using information supplied in the request body.

### Request Body

```json
{
  "title": "Learning Node.js",
  "author": "Andrew"
}
```

### cURL Example

```bash
curl -X POST http://localhost:3003/books \
-H "Content-Type: application/json" \
-d '{"title":"Learning Node.js","author":"Andrew"}'
```

### Response

```json
{
  "id": 1723456789012,
  "title": "Learning Node.js",
  "author": "Andrew"
}
```

### Status Code

```text
201 Created
```

---

# 4. Update a Book with PUT

```http
PUT /books/:id
```

`PUT` is used when the client wants to **replace the entire resource**.

### Request

```bash
curl -X PUT http://localhost:3003/books/1 \
-H "Content-Type: application/json" \
-d '{"title":"Advanced Node.js","author":"Andrew"}'
```

### Result

The existing book is completely replaced with the new representation:

```json
{
  "id": 1,
  "title": "Advanced Node.js",
  "author": "Andrew"
}
```

Both `title` and `author` are required.

If either is missing:

```json
{
  "message": "Title and author are required"
}
```

Status:

```text
400 Bad Request
```

---

# 5. Partially Update a Book with PATCH

```http
PATCH /books/:id
```

`PATCH` is used when the client wants to **modify only part of a resource**.

For example, to change only the title:

```bash
curl -X PATCH http://localhost:3003/books/1 \
-H "Content-Type: application/json" \
-d '{"title":"Mastering Node.js"}'
```

The author remains unchanged.

### Response

```json
{
  "id": 1,
  "title": "Mastering Node.js",
  "author": "Andrew"
}
```

You can also update only the author:

```json
{
  "author": "New Author"
}
```

Or update both:

```json
{
  "title": "New Book Title",
  "author": "New Author"
}
```

---

# 6. Delete a Book

```http
DELETE /books/:id
```

Removes the requested book from the collection.

### Example

```bash
curl -X DELETE http://localhost:3003/books/1
```

### Response

```json
{
  "message": "Book deleted successfully"
}
```

### Status Code

```text
200 OK
```

If the book does not exist:

```json
{
  "message": "Book not found"
}
```

Status:

```text
404 Not Found
```

---

# 🧠 Key Concepts

## 1. GET

`GET` retrieves information from the server.

This project uses two GET routes:

```text
GET /books
GET /books/:id
```

The first retrieves all books, while the second retrieves one specific book.

---

## 2. POST

`POST` creates a new resource.

The project receives data through:

```javascript
const { title, author } = req.body;
```

The new book is then added to the collection:

```javascript
books.push(newBook);
```

---

## 3. PUT

`PUT` represents a complete replacement of a resource.

The project replaces the entire book object:

```javascript
books[index] = {
  id: id,
  title: title,
  author: author,
};
```

This is different from `PATCH`, which modifies only the fields provided.

---

## 4. PATCH

`PATCH` performs a partial update.

The project checks whether individual fields were provided:

```javascript
if (req.body.title !== undefined) {
  book.title = req.body.title;
}
```

This means the client can update the title without sending the author again.

---

## 5. DELETE

`DELETE` removes a resource.

The project uses `filter()` to create a new array without the requested book:

```javascript
books = books.filter((book) => book.id !== id);
```

---

# 📦 JSON Request Bodies

The application enables JSON parsing with:

```javascript
app.use(express.json());
```

Without this middleware, Express would not automatically parse incoming JSON request bodies.

For example:

```json
{
  "title": "Learning Express",
  "author": "John"
}
```

becomes accessible through:

```javascript
req.body
```

---

# 🛡️ Validation

The API validates required fields when creating or completely replacing a book.

For `POST`:

```javascript
if (!title || !author) {
  return res.status(400).json({
    message: "Title and author are required",
  });
}
```

The same validation is applied to `PUT`.

This demonstrates an important backend principle:

> **Never assume that the client will send valid data.**

The server should validate incoming requests before modifying its data.

---

# 🔢 URL Parameters

The API uses:

```text
/books/:id
```

The requested ID is available through:

```javascript
req.params.id
```

Because URL parameters arrive as strings, the project converts the value into a number:

```javascript
const id = Number(req.params.id);
```

This allows the ID to be compared against the numeric IDs stored in the books array.

---

# 📊 HTTP Status Codes

This project demonstrates several important HTTP status codes:

| Status | Meaning     | Used For                             |
| ------ | ----------- | ------------------------------------ |
| `200`  | OK          | Successful retrieval/update/deletion |
| `201`  | Created     | Successfully creating a book         |
| `400`  | Bad Request | Missing required data                |
| `404`  | Not Found   | Book does not exist                  |

Understanding status codes is essential because they allow clients to understand what happened to their request.

---

# ⚖️ PUT vs PATCH

One of the most important concepts in this project is the difference between `PUT` and `PATCH`.

### PUT

Replace the entire resource:

```json
{
  "title": "New Title",
  "author": "New Author"
}
```

### PATCH

Change only the required fields:

```json
{
  "title": "New Title"
}
```

Conceptually:

```text
PUT
Old Resource
     ↓
Complete Replacement
     ↓
New Resource


PATCH
Old Resource
     ↓
Partial Modification
     ↓
Updated Resource
```

---

# 🔁 Complete CRUD Flow

The complete lifecycle of a book looks like:

```text
             CREATE
                │
                ▼
         POST /books
                │
                ▼
             Book
                │
        ┌───────┴────────┐
        │                │
        ▼                ▼
      READ             UPDATE
        │                │
        ▼          ┌─────┴─────┐
 GET /books         │           │
 GET /books/:id    PUT        PATCH
        │           │           │
        │           └─────┬─────┘
        │                 │
        └────────┬────────┘
                 │
                 ▼
              DELETE
                 │
                 ▼
          DELETE /books/:id
```

---

# 📁 Project Structure

```text
project-03/
│
├── index.js
├── package.json
└── README.md
```

### `index.js`

Contains the Express server, book data, CRUD routes, validation, and server configuration.

### `package.json`

Contains the project's Node.js configuration and dependencies.

### `README.md`

Contains the documentation for the API and the concepts demonstrated.

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
http://localhost:3003
```

You should see:

```text
Server running on http://localhost:3003
```

---

# 🧪 Testing

You can test the API with:

* Postman
* cURL
* Thunder Client
* VS Code REST Client
* Insomnia

### Get all books

```bash
curl http://localhost:3003/books
```

### Get one book

```bash
curl http://localhost:3003/books/1
```

### Create a book

```bash
curl -X POST http://localhost:3003/books \
-H "Content-Type: application/json" \
-d '{"title":"Learning APIs","author":"Andrew"}'
```

### Replace a book

```bash
curl -X PUT http://localhost:3003/books/1 \
-H "Content-Type: application/json" \
-d '{"title":"Advanced APIs","author":"Andrew"}'
```

### Partially update a book

```bash
curl -X PATCH http://localhost:3003/books/1 \
-H "Content-Type: application/json" \
-d '{"title":"Advanced REST APIs"}'
```

### Delete a book

```bash
curl -X DELETE http://localhost:3003/books/1
```

---

# 💡 Possible Improvements

This project intentionally uses an in-memory array to keep the focus on HTTP methods and CRUD operations.

Possible improvements include:

* Connect the API to PostgreSQL
* Add MongoDB
* Add request validation with a validation library
* Add centralized error handling
* Add authentication and authorization
* Add pagination
* Add search and filtering
* Add database transactions
* Add automated tests
* Add API documentation
* Add environment variables
* Add logging
* Add a service/controller architecture

These improvements can be explored in later blueprints.

---

# 🎓 Learning Outcome

After completing this project, you should be able to explain:

* What CRUD means
* What `GET` does
* What `POST` does
* What `PUT` does
* What `PATCH` does
* What `DELETE` does
* The difference between `PUT` and `PATCH`
* How URL parameters work
* How JSON request bodies work
* Why request validation matters
* How HTTP status codes communicate results
* How a REST API manages resources

The most important concept is understanding that **HTTP methods communicate the intended operation between the client and server**.

---

# 🔗 Blueprint Information

**Series:** Backend System Design — 40 Project Blueprints

**Project:** 03 / 40

**Concept:** HTTP Methods & CRUD

**Focus:** Understanding the HTTP methods used to create, retrieve, update, and delete backend resources.

---

# 👨‍💻 Creator

**Andrew Emaye**

This project is part of my practical backend development and system-design learning series, focused on understanding the architectures, patterns, and building blocks used to create scalable applications.

---

# 🔒 Privacy Policy

This project is an educational backend application and does not intentionally collect, store, sell, or share personal user information.

All book data is stored temporarily in the application's server memory and is used solely for demonstration purposes.

No external user database or personal information collection is implemented.

If this project is extended to process real user information or third-party services, appropriate privacy and data-protection measures should be implemented.

---

# 📄 License

This project is licensed under the **MIT License**.

You are free to use, copy, modify, merge, publish, distribute, sublicense, and sell copies of the project, subject to the conditions of the MIT License.

See the `LICENSE` file in this repository for the full license text.

---

## ⭐ Keep Learning

**Build it. Break it. Understand it. Scale it.**
