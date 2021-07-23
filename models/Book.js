const mongoose = require("mongoose");

const BookSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  author: {
    type: String,
    required: true,
  },
  price: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: false,
  },
  created: {
    type: Date,
    default: Date.now,
  },
  img: {
      type: String,
      required: false
  }
});

const Book = mongoose.model("Book", BookSchema);

module.exports = Book;
