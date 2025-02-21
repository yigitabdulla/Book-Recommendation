// models/bookModel.js
const mongoose = require('mongoose');

const bookSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    authors: [String],
    categories: [String],
    description: String,
    thumbnail: String,
    googleId: { type: String, unique: true, required: true },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Book', bookSchema);
