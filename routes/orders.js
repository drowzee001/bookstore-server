const express = require("express");
const router = express.Router();
const auth = require("../middleware/auth");

const Order = require("../models/Order");

//Get Orders
router.get("/", auth, (req, res) => {
  Order.find()
    .where("user_id", req.user.data._id)
    .then((orders) => {
      res.json(orders);
    });
});

//Get All Orders
router.get("/all", auth, (req, res) => {
  if (req.user.data.admin) {
    Order.find().then((orders) => {
      res.json(orders);
    });
  }
  else {
    res.status(401).json({msg: "Admin access only"})
  }
});

//Get Order
router.get("/:id", auth, (req, res) => {
  const order_id = req.params.id;
  const user_id = req.user.data._id;
  console.log(user_id);
  Order.find()
    .where("_id", order_id)
    .then((order) => res.json(order));
});

//Add Order
router.post("/", auth, (req, res) => {
  const order = new Order(req.body.order);
  order
    .save()
    .then(() => res.json({ msg: "success" }))
    .catch((e) => res.send(e));
});

//Delete Order
router.delete("/:id", auth, (req, res) => {
  Order.findByIdAndDelete(req.params.id).then(() =>
    res.json({ msg: "success" })
  );
});

module.exports = router;
