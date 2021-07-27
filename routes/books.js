const express = require("express");
const router = express.Router();
const auth = require("../middleware/auth");

const Book = require("../models/Book");

//Get Books 
router.get("/", auth, (req, res) => {
  const page = req.query.page;
  Book.find()
    .limit(10)
    .skip((page - 1) * 10)
    .then((books) => {
      res.json(books);
    });
});

//Get Books Count
router.get("/count", auth, (req, res) => {
  Book.count().then((count) => {
    res.json(count);
  });
});

//Add Book
router.post("/", auth, (req, res) => {
  const book = new Book(req.body.book);
  book
    .save()
    .then(() => res.json({ msg: "success" }))
    .catch((e) => res.send(e));
});

//Get Book
router.get("/:id", auth, (req, res) => {
  Book.findById(req.params.id).then((book) => res.json(book));
});

//Edit Book
router.post("/edit", auth, (req, res) => {
  const book = req.body.book;
  Book.findByIdAndUpdate(book._id, book).then(() =>
    res.json({ msg: "success" })
  );
});

//Delete Book
router.delete("/:id", auth, (req, res) => {
  if (req.user.data.admin) {
    Book.findByIdAndDelete(req.params.id).then(() =>
      res.json({ msg: "success" })
    );
  }
});

module.exports = router;
