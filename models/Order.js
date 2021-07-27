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

const OrderSchema = new mongoose.Schema({
  user_id: {
    type: String,
    required: true,
  },
  items: {
    type: [CartItemSchema],
    required: true,
  },
  subtotal: {
    type: Number,
    required: true,
  },
  taxes: {
    type: Number,
    required: true,
  },
  shipping: {
    type: Number,
    required: true,
  },
  orderTotal: {
    type: Number,
    required: true,
  },
  created: {
    type: Date,
    required: true,
    default: new Date(),
  },
});

const Order = mongoose.model("Order", OrderSchema);

module.exports = Order;
