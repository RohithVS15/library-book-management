const express = require("express");
const router = express.Router();
const Book = require("./models/Book");

// Get all books
router.get("/", async (req, res) => {
  const books = await Book.find();
  res.json(books);
});

// Add a new book
router.post("/add", async (req, res) => {
  const { title, author, year } = req.body;
  await Book.create({ title, author, year });
  res.json({ message: "Book Added Successfully" });
});

// Delete a book
router.delete("/:id", async (req, res) => {
  await Book.findByIdAndDelete(req.params.id);
  res.json({ message: "Book Deleted Successfully" });
});

module.exports = router; // ✅ must export router
