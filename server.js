const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config();
const Book = require("./models/Book");

const app = express();

// ✅ CORS FIX — Add your deployed frontend URL
app.use(
  cors({
    origin: ["https://library-book-management.onrender.com"],
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type"],
  })
);

app.use(express.json());
app.use(express.static("public"));

// ✅ MongoDB Connect
mongoose
  .connect(process.env.MONGO_URI, {
    serverSelectionTimeoutMS: 5000,
  })
  .then(() => console.log("✅ MongoDB Atlas Connected"))
  .catch((err) => console.log("❌ DB Error:", err.message));

// ✅ Routes
app.get("/api/books", async (req, res) => {
  const books = await Book.find().sort({ _id: -1 });
  res.json(books);
});

app.post("/api/books", async (req, res) => {
  const book = await Book.create(req.body);
  res.json(book);
});

app.put("/api/books/:id", async (req, res) => {
  const updatedBook = await Book.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
  });
  res.json(updatedBook);
});

app.delete("/api/books/:id", async (req, res) => {
  await Book.findByIdAndDelete(req.params.id);
  res.json({ message: "Book deleted" });
});

// ✅ Deploy port
const PORT = process.env.PORT || 4000;
app.listen(PORT, () => console.log(`✅ Server running on port ${PORT}`));
