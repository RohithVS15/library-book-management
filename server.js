const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config();
const Book = require("./models/Book");

const app = express();
app.use(cors());
app.use(express.json());
app.use(express.static("public"));

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("✅ MongoDB Atlas Connected"))
  .catch((err) => console.log(err));

// ✅ Get all books
app.get("/api/books", async (req, res) => {
  const books = await Book.find().sort({ _id: -1 });
  res.json(books);
});

// ✅ Add new book
app.post("/api/books", async (req, res) => {
  const book = await Book.create(req.body);
  res.json(book);
});

// ✅ Update book (✔ THIS WAS MISSING!)
app.put("/api/books/:id", async (req, res) => {
  const updatedBook = await Book.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
  });
  res.json(updatedBook);
});

// ✅ Delete book
app.delete("/api/books/:id", async (req, res) => {
  await Book.findByIdAndDelete(req.params.id);
  res.json({ message: "Book deleted" });
});

// ✅ Run server
const PORT = process.env.PORT || 4000;
app.listen(PORT, () =>
  console.log(`✅ Server running at http://localhost:${PORT}`)
);
