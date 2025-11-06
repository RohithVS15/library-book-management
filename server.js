const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const path = require("path");
const Book = require("./models/Book");
const User = require("./models/User");

const app = express();
app.use(express.json());
app.use(cors());

// ✅ Serve static frontend files
app.use(express.static(path.join(__dirname, "public")));

// ✅ MongoDB connection
mongoose
  .connect(
    "mongodb+srv://yourUsername:yourPassword@cluster0.cnhnbiw.mongodb.net/library",
    {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    }
  )
  .then(() => console.log("✅ MongoDB Connected ✅"))
  .catch((err) => console.error("❌ MongoDB Error:", err));

// ✅ User Registration
app.post("/api/register", async (req, res) => {
  const { username, password } = req.body;

  const existingUser = await User.findOne({ username });
  if (existingUser) return res.json({ message: "User already exists" });

  const newUser = new User({ username, password });
  await newUser.save();
  res.json({ message: "Registration successful" });
});

// ✅ User Login
app.post("/api/login", async (req, res) => {
  const { username, password } = req.body;
  const user = await User.findOne({ username, password });

  if (!user) return res.json({ message: "Invalid credentials" });

  res.json({ message: "Login successful" });
});

// ✅ CRUD - Books
app.post("/api/books", async (req, res) => {
  const { title, author, genre, year } = req.body;
  const newBook = new Book({ title, author, genre, year });
  await newBook.save();
  res.json(newBook);
});

app.get("/api/books", async (req, res) => {
  const books = await Book.find();
  res.json(books);
});

app.put("/api/books/:id", async (req, res) => {
  const updated = await Book.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
  });
  res.json(updated);
});

app.delete("/api/books/:id", async (req, res) => {
  await Book.findByIdAndDelete(req.params.id);
  res.json({ message: "Deleted Successfully" });
});

// ✅ Default Route → Open index.html
app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "index.html"));
});

const PORT = process.env.PORT || 10000;
app.listen(PORT, () => console.log(`✅ Server running on port ${PORT}`));
