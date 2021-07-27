const mongoose = require("mongoose");

const CartItemSchema = new mongoose.Schema({
  user_id: {
    type: String,
    required: true,
  },
  book_id: {
    type: String,
    required: true,
  },
  quantity: {
    type: Number,
    required: true,
  },
});

const CartItem = mongoose.model("CartItem", CartItemSchema);
module.exports = CartItem;
