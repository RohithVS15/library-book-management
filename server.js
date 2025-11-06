const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const app = express();
app.use(express.json());

// ✅ CORS Fix for Localhost + Render
app.use(
  cors({
    origin: "*",
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

// ✅ Mongoose Connection
mongoose
  .connect("mongodb+srv://vsr:vsr@cluster0.cnhnbiw.mongodb.net/libraryDB")
  .then(() => console.log("✅ MongoDB Connected Successfully"))
  .catch((err) => console.log("❌ MongoDB Error:", err));

// ✅ Book Schema
const bookSchema = new mongoose.Schema({
  title: String,
  author: String,
});

const Book = mongoose.model("Book", bookSchema);

// ✅ User Schema
const userSchema = new mongoose.Schema({
  name: String,
  email: { type: String, unique: true },
  password: String,
});

const User = mongoose.model("User", userSchema);

// ✅ Helper - JWT Secret
const JWT_SECRET = "library_secret_key";

// ✅ Registration API
app.post("/api/auth/register", async (req, res) => {
  try {
    const { name, email, password } = req.body;

    const existingUser = await User.findOne({ email });
    if (existingUser)
      return res.status(400).json({ message: "Email already exists" });

    const hashedPassword = await bcrypt.hash(password, 10);

    await User.create({ name, email, password: hashedPassword });
    res.json({ message: "User registered successfully ✅" });
  } catch (error) {
    res.status(500).json({ message: "❌ Server Error", error });
  }
});

// ✅ Login API
app.post("/api/auth/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user)
      return res.status(400).json({ message: "Invalid email or password" });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch)
      return res.status(400).json({ message: "Invalid email or password" });

    const token = jwt.sign({ id: user._id, name: user.name }, JWT_SECRET);
    res.json({ message: "Login successful ✅", token, name: user.name });
  } catch (error) {
    res.status(500).json({ message: "❌ Server Error", error });
  }
});

// ✅ Middleware to Verify Token
function checkAuth(req, res, next) {
  const token = req.headers.authorization?.split(" ")[1];
  if (!token) return res.status(401).json({ message: "Unauthorized" });

  jwt.verify(token, JWT_SECRET, (err, decoded) => {
    if (err) return res.status(403).json({ message: "Invalid Token" });
    req.user = decoded;
    next();
  });
}

// ✅ Add Book
app.post("/api/books", checkAuth, async (req, res) => {
  const { title, author } = req.body;
  await Book.create({ title, author });
  res.json({ message: "Book added successfully ✅" });
});

// ✅ Get All Books
app.get("/api/books", checkAuth, async (req, res) => {
  const books = await Book.find();
  res.json(books);
});

// ✅ Update Book
app.put("/api/books/:id", checkAuth, async (req, res) => {
  await Book.findByIdAndUpdate(req.params.id, req.body);
  res.json({ message: "Book updated ✅" });
});

// ✅ Delete Book
app.delete("/api/books/:id", checkAuth, async (req, res) => {
  await Book.findByIdAndDelete(req.params.id);
  res.json({ message: "Book deleted ✅" });
});

// ✅ Default Route
app.get("/", (req, res) => {
  res.send("Library Book Management API is Running ✅");
});

// ✅ Server start
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`✅ Server running on port ${PORT}`));
