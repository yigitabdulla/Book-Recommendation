// models/bookModel.js
const mongoose = require('mongoose');

const recommendationSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    authors: String,
    description: String,
  },
  { timestamps: true }
);

module.exports = mongoose.model('Recommendation', recommendationSchema);
