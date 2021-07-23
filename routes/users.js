const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");
const auth = require("../middlware/auth");
const jwt = require("jsonwebtoken");

const User = require("../models/User");

router.get("/logout", (req) => {
  req.logout();
});

router.post("/login", (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) res.status(400).json({ msg: "Missing Fields" });

  User.findOne({ email }).then((user) => {
    if (!user) {
      res.status(401).send("User not found");
    }
    bcrypt.compare(password, user.password, (err, isMatch) => {
      if (isMatch) {
        const token = jwt.sign({ data: user }, process.env.SECRET, {
          expiresIn: 3600, // 1 hour
        });
        res.json({
          token: token,
          user,
        });
      } else {
        return res.status(401).json({ msg: "Wrong password" });
      }
    });
  });
});

router.post("/register", (req, res) => {
  const { firstName, lastName, email, password, created, admin } = req.body;

  if (!firstName || !lastName || !email || !password || admin == null) {
    res.status(400).send("Missing Fields");
  }

  User.findOne({ email })
    .then((user) => {
      if (user) {
        res.status(400).send("User already exists");
      } else {
        const newUser = new User({
          firstName,
          lastName,
          email,
          password,
          created,
          admin,
        });

        bcrypt.genSalt(10, (err, salt) => {
          bcrypt.hash(newUser.password, salt, (err, hash) => {
            if (err) throw err;
            else {
              newUser.password = hash;
              newUser
                .save()
                .then((user) => {
                  const token = jwt.sign({ data: user }, process.env.SECRET, {
                    expiresIn: 3600, // 1 hour
                  });
                  res.json({
                    token: token,
                    user,
                  });
                })
                .catch((e) => console.log(e));
            }
          });
        });
      }
    })
    .catch((e) => console.log(e));
});

router.get("/", auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.data._id).select("-password");
    if (!user) throw Error("User does not exist");
    res.json(user);
  } catch (e) {
    res.status(400).json({ msg: e.message });
  }
});

module.exports = router;
