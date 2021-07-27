const express = require("express");
const mongoose = require("mongoose");
const morgan = require("morgan");
const cors = require("cors");

require("dotenv").config();

const app = express();
const port = process.env.PORT || 3000;

const db = process.env.MONGO_URI;

mongoose
  .connect(db, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useFindAndModify: false,
  })
  .then(() => console.log("MongoDB Connected"))
  .catch((e) => console.log(e));

app.use(express.json({ limit: "5mb" }));
app.use(cors({
  origin: "https://bookstore.donovanrowzee.net",
  credentials: true,
}));

// if (process.env.NODE_ENV === 'development') {
app.use(morgan("dev"));
// }

app.get("/", (req, res) => {
  res.send("Invalid Endpoint");
});

app.use("/books", require("./routes/books"));
app.use("/cartItems", require("./routes/cartItems"));
app.use("/orders", require("./routes/orders"));
app.use("/users", require("./routes/users.js"));

app.listen(port, () => console.log(`Example app listening on port ${port}!`));
