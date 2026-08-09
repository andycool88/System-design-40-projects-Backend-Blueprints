// Import the Express framework so we can create our HTTP server.
const express = require("express");

// Create an Express application instance.
const app = express();

// Tell Express to automatically parse JSON request bodies.
app.use(express.json());

// Create some temporary book data that will live in server memory.
let books = [
  {
    id: 1,
    title: "Node.js Basics",
    author: "Andrew",
  },
  {
    id: 2,
    title: "Learning Express",
    author: "John",
  },
];

// Handle GET requests sent to /books.
app.get("/books", (req, res) => {
  // Send all books back to the client with a 200 OK status.
  res.status(200).json(books);
});

// Handle GET requests sent to /books/:id.
app.get("/books/:id", (req, res) => {
  // Convert the ID from the URL from a string into a number.
  const id = Number(req.params.id);

  // Search the books array for a book with the requested ID.
  const book = books.find((book) => book.id === id);

  // Check whether the requested book was found.
  if (!book) {
    // Return a 404 response when the book does not exist.
    return res.status(404).json({
      message: "Book not found",
    });
  }

  // Return the requested book with a successful 200 response.
  res.status(200).json(book);
});

// Handle POST requests sent to /books.
app.post("/books", (req, res) => {
  // Extract the title and author from the JSON request body.
  const { title, author } = req.body;

  // Check whether the client supplied both required values.
  if (!title || !author) {
    // Return a 400 Bad Request response when data is missing.
    return res.status(400).json({
      message: "Title and author are required",
    });
  }

  // Create a new book object.
  const newBook = {
    // Generate a simple unique ID using the current timestamp.
    id: Date.now(),

    // Store the title supplied by the client.
    title: title,

    // Store the author supplied by the client.
    author: author,
  };

  // Add the new book to the books array.
  books.push(newBook);

  // Return the newly created book with a 201 Created response.
  res.status(201).json(newBook);
});

// Handle PUT requests sent to /books/:id.
app.put("/books/:id", (req, res) => {
  // Convert the URL ID from a string into a number.
  const id = Number(req.params.id);

  // Find the position of the requested book inside the array.
  const index = books.findIndex((book) => book.id === id);

  // Check whether the book exists.
  if (index === -1) {
    // Return 404 when the book cannot be found.
    return res.status(404).json({
      message: "Book not found",
    });
  }

  // Extract the replacement values from the request body.
  const { title, author } = req.body;

  // Check whether both replacement values were provided.
  if (!title || !author) {
    // Return 400 when the replacement data is incomplete.
    return res.status(400).json({
      message: "Title and author are required",
    });
  }

  // Replace the entire existing book with the new representation.
  books[index] = {
    // Keep the original ID.
    id: id,

    // Replace the title.
    title: title,

    // Replace the author.
    author: author,
  };

  // Return the completely replaced book.
  res.status(200).json(books[index]);
});

// Handle PATCH requests sent to /books/:id.
app.patch("/books/:id", (req, res) => {
  // Convert the URL ID into a number.
  const id = Number(req.params.id);

  // Find the book that should be partially updated.
  const book = books.find((book) => book.id === id);

  // Check whether the book exists.
  if (!book) {
    // Return 404 when the book does not exist.
    return res.status(404).json({
      message: "Book not found",
    });
  }

  // Check whether the client sent a new title.
  if (req.body.title !== undefined) {
    // Update only the title when one was supplied.
    book.title = req.body.title;
  }

  // Check whether the client sent a new author.
  if (req.body.author !== undefined) {
    // Update only the author when one was supplied.
    book.author = req.body.author;
  }

  // Return the partially updated book.
  res.status(200).json(book);
});

// Handle DELETE requests sent to /books/:id.
app.delete("/books/:id", (req, res) => {
  // Convert the URL ID into a number.
  const id = Number(req.params.id);

  // Remember how many books existed before deletion.
  const oldLength = books.length;

  // Remove the book whose ID matches the requested ID.
  books = books.filter((book) => book.id !== id);

  // Check whether anything was actually deleted.
  if (books.length === oldLength) {
    // Return 404 when no matching book existed.
    return res.status(404).json({
      message: "Book not found",
    });
  }

  // Return a successful response after deleting the book.
  res.status(200).json({
    message: "Book deleted successfully",
  });
});

// Store the port number where our server will listen.
const PORT = 3003;

// Start the Express server.
app.listen(PORT, () => {
  // Tell us in the terminal that the server started successfully.
  console.log(`Server running on http://localhost:${PORT}`);
});