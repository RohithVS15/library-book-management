import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import path from "path";
import dotenv from "dotenv";
import User from "./models/User.js";
import Book from "./models/Book.js";
import jwt from "jsonwebtoken";

dotenv.config();
const app = express();
app.use(express.json());
app.use(cors());

// Serve frontend
const __dirname = path.resolve();
app.use(express.static(path.join(__dirname, "public")));

// ✅ MongoDB Connection
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("✅ MongoDB Connected"))
  .catch((err) => console.log("❌ MongoDB Error:", err));

// ✅ Token Middleware
function verifyToken(req, res, next) {
  const token = req.headers["authorization"]?.split(" ")[1];
  if (!token) return res.json({ message: "Unauthorized" });

  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    if (err) return res.json({ message: "Invalid Token" });
    req.user = user;
    next();
  });
}

/* ---------------- AUTH API ---------------- */

// REGISTER
app.post("/api/auth/register", async (req, res) => {
  const { name, email, password } = req.body;
  const user = await User.create({ name, email, password });
  res.json({ message: "✅ Registered Successfully" });
});

// LOGIN
app.post("/api/auth/login", async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email, password });
  if (!user) return res.json({ message: "❌ Invalid Credentials" });

  const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET);
  res.json({ token, name: user.name });
});

/* ---------------- BOOK API ---------------- */

app.get("/api/books", verifyToken, async (req, res) => {
  const books = await Book.find();
  res.json(books);
});

app.post("/api/books", verifyToken, async (req, res) => {
  const book = await Book.create(req.body);
  res.json({ message: "📚 Book Added", book });
});

app.delete("/api/books/:id", verifyToken, async (req, res) => {
  await Book.findByIdAndDelete(req.params.id);
  res.json({ message: "🗑 Book Deleted" });
});

/* -------- Serve Frontend for All Routes -------- */
app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "index.html"));
});

const PORT = process.env.PORT || 10000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
