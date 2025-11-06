const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const path = require("path");

const app = express();
app.use(express.json());

// ✅ Allow all origins for now (Render + Localhost)
app.use(
  cors({
    origin: "*",
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

// ✅ Serve Frontend
app.use(express.static(path.join(__dirname, "public")));

// ✅ MongoDB Atlas Connection
mongoose
  .connect(
    "mongodb+srv://vsr:vsr@cluster0.cnhnbiw.mongodb.net/libraryDB?retryWrites=true&w=majority"
  )
  .then(() => console.log("✅ MongoDB Connected Successfully"))
  .catch((err) => console.log("❌ MongoDB Error:", err));

// ✅ Book Schema Updated
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

// ✅ Register User
app.post("/api/auth/register", async (req, res) => {
  try {
    const { name, email, password } = req.body;

    const exists = await User.findOne({ email });
    if (exists)
      return res.status(400).json({ message: "Email already exists ❌" });

    const hashed = await bcrypt.hash(password, 10);
    await User.create({ name, email, password: hashed });

    res.json({ message: "✅ Registered Successfully" });
  } catch {
    res.status(500).json({ message: "Server Error ❌" });
  }
});

// ✅ Login User
app.post("/api/auth/login", async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email });

  if (!user) return res.status(400).json({ message: "Invalid Credentials ❌" });

  const match = await bcrypt.compare(password, user.password);
  if (!match) return res.status(400).json({ message: "Wrong Password ❌" });

  const token = jwt.sign({ id: user._id, name: user.name }, JWT_SECRET);

  res.json({ message: "✅ Login Successful", token, name: user.name });
});

// ✅ Check Auth
function checkAuth(req, res, next) {
  let token = req.headers.authorization;
  if (!token) return res.status(401).json({ message: "Unauthorized ❌" });

  token = token.split(" ")[1]; // Remove Bearer
  jwt.verify(token, JWT_SECRET, (err, decoded) => {
    if (err) return res.status(403).json({ message: "Invalid Token ❌" });
    req.user = decoded;
    next();
  });
}

// ✅ CRUD APIs
app.post("/api/books", checkAuth, async (req, res) => {
  const book = await Book.create(req.body);
  res.json(book);
});

app.get("/api/books", checkAuth, async (req, res) => {
  const books = await Book.find().sort({ _id: -1 });
  res.json(books);
});

app.put("/api/books/:id", checkAuth, async (req, res) => {
  const book = await Book.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
  });
  res.json(book);
});

app.delete("/api/books/:id", checkAuth, async (req, res) => {
  await Book.findByIdAndDelete(req.params.id);
  res.json({ message: "🗑️ Book Deleted" });
});

// ✅ Handle Render Deployment Routing
app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "index.html"));
});

// ✅ Start Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`✅ Server running on port ${PORT}`));
