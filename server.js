const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const path = require("path");

const app = express();
app.use(express.json());

// ✅ Allow frontend access
app.use(
  cors({
    origin: "*",
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

// ✅ Connect MongoDB
mongoose
  .connect("mongodb+srv://vsr:vsr@cluster0.cnhnbiw.mongodb.net/libraryDB")
  .then(() => console.log("✅ MongoDB Connected"))
  .catch((err) => console.log("❌ MongoDB Error:", err));

// ✅ Book Schema
const bookSchema = new mongoose.Schema({
  title: String,
  author: String,
  year: Number,
});

const Book = mongoose.model("Book", bookSchema);

// ✅ User Schema
const userSchema = new mongoose.Schema({
  name: String,
  email: { type: String, unique: true },
  password: String,
});
const User = mongoose.model("User", userSchema);

// ✅ JWT Secret
const JWT_SECRET = "library_secret_key";

// ✅ Register API
app.post("/api/auth/register", async (req, res) => {
  const { name, email, password } = req.body;
  const exists = await User.findOne({ email });
  if (exists) return res.status(400).json({ message: "Email already exists" });

  const hashed = await bcrypt.hash(password, 10);
  await User.create({ name, email, password: hashed });
  res.json({ message: "User registered ✅" });
});

// ✅ Login API
app.post("/api/auth/login", async (req, res) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email });
  if (!user) return res.status(400).json({ message: "Invalid credentials" });

  const match = await bcrypt.compare(password, user.password);
  if (!match) return res.status(400).json({ message: "Invalid credentials" });

  const token = jwt.sign({ id: user._id, name: user.name }, JWT_SECRET);
  res.json({ message: "Login OK ✅", token, name: user.name });
});

// ✅ Token Middleware
function auth(req, res, next) {
  const token = req.headers.authorization;
  if (!token) return res.status(401).json({ message: "Unauthorized" });

  jwt.verify(token, JWT_SECRET, (err, decoded) => {
    if (err) return res.status(403).json({ message: "Invalid Token" });
    req.user = decoded;
    next();
  });
}

// ✅ CRUD Books
app.post("/api/books", auth, async (req, res) => {
  const { title, author, year } = req.body;
  await Book.create({ title, author, year });
  res.json({ message: "Book added ✅" });
});

app.get("/api/books", auth, async (req, res) => {
  const books = await Book.find();
  res.json(books);
});

app.delete("/api/books/:id", auth, async (req, res) => {
  await Book.findByIdAndDelete(req.params.id);
  res.json({ message: "Book deleted ✅" });
});

// ✅ Serve Frontend Files
app.use(express.static(__dirname));

// ✅ Fallback to index.html for all routes
app.use((req, res) => {
  res.sendFile(path.join(__dirname, "index.html"));
});

// ✅ Start Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`✅ Server running on port ${PORT}`));
