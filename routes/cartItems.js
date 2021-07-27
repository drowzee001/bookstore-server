const express = require("express");
const router = express.Router();
const auth = require("../middleware/auth");

const CartItem = require("../models/CartItem");

router.get("/", auth, (req, res) => {
  console.log(req.user.data._id)
  CartItem.find()
    .where("user_id", req.user.data._id)
    .then((cartItems) => {
      res.json( cartItems );
    });
});
router.get("/:bookId", auth, (req, res) => {
  const book_id = req.params.bookId;
  const user_id = req.user.data._id;
  console.log(user_id);
  CartItem.find()
    .and([{ book_id: book_id }, { user_id: user_id }])
    .then((cartItem) => res.json(cartItem));
});
router.post("/", auth, (req, res) => {
  const cartItem = new CartItem(req.body.cartItem);
  cartItem
    .save()
    .then(() => res.json({ msg: "success" }))
    .catch((e) => res.send(e));
});
router.post("/update", auth, (req, res) => {
  const cartItem = new CartItem(req.body.cartItem);
  console.log(cartItem);
  CartItem.findByIdAndUpdate(cartItem._id, cartItem)
    .then((cartItem) => res.json(cartItem))
    .catch((e) => res.json({ msg: e }));
});
router.post("/edit", auth, (req, res) => {
  const cartItem = req.body.cartItem;
  console.log(cartItem.price);
  CartItem.findByIdAndUpdate(cartItem._id, cartItem).then(() =>
    res.json({ msg: "success" })
  );
});
router.delete("/:id", auth, (req, res) => {
    CartItem.findByIdAndDelete(req.params.id).then(() =>
      res.json({ msg: "success" })
    );
});

module.exports = router;
