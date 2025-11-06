const mongoose = require("mongoose");

const bookSchema = new mongoose.Schema({
  title: String,
  author: String,
  year: String,
});

module.exports = mongoose.model("Book", bookSchema);
