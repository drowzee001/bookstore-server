const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");
const auth = require("../middleware/auth");
const jwt = require("jsonwebtoken");

const User = require("../models/User");

//User Logout
router.get("/logout", (req) => {
  req.logout();
});

//User Login
router.post("/login", (req, res) => {
  const email = req.body.email.toLowerCase();
  const password = req.body.password;
  if (!email || !password) res.status(400).json({ msg: "Missing Fields" });
  email;
  User.findOne({ email }).then((user) => {
    if (!user || user === null) {
      return res.status(401).json({ msg: "User not found" });
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
        return res.status(401).json({ msg: "Incorrect password" });
      }
    });
  });
});

//User Register
router.post("/register", (req, res) => {
  const { firstName, lastName, password, created } = req.body;
  const email = req.body.email.toLowerCase();

  if (!firstName || !lastName || !email || !password) {
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
          admin: false,
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

//User Auth
router.get("/", auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.data._id).select("-password");
    if (!user) throw Error("User does not exist");
    res.json(user);
  } catch (e) {
    res.status(400).json({ msg: e.message });
  }
});

//Admin Routes

//Get Users
router.get("/all", auth, async (req, res) => {
  if (req.user.data.admin) {
    User.find().then((users) => {
      res.json(users);
    });
  } else {
    res.status(401).json({ msg: "Admin access only" });
  }
});

//Get User
router.get("/:id", auth, (req, res) => {
  if (req.user.data.admin) {
    User.findById(req.params.id)
      // .select("-password")
      .then((user) => res.json(user));
  } else {
    res.status(401).json({ msg: "Admin access only" });
  }
});

//Add User
router.post("/", auth, (req, res) => {
  if (req.user.data.admin) {
    const { firstName, lastName, password, created, admin } = req.body;
    const email = req.body.email.toLowerCase();

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
  } else {
    res.status(401).json({ msg: "Admin Access only" });
  }
});

//Edit User
router.post("/edit", auth, (req, res) => {
  if (req.user.data.admin) {
    const password = req.body.user.password;
    if (password) {
      bcrypt.genSalt(10, (err, salt) => {
        bcrypt.hash(password, salt, (err, hash) => {
          if (err) throw err;
          else {
            req.body.user.password = hash;
            req.body.user.email = req.body.user.email.toLowerCase();
            User.findByIdAndUpdate(req.body.user._id, req.body.user, {
              omitUndefined: true,
            }).then(() => {
              res.json({ msg: "success" });
            });
          }
        });
      });
    } else {
      console.log("no");
      req.body.user.email = req.body.user.email.toLowerCase();
      User.findByIdAndUpdate(req.body.user._id, req.body.user, {
        omitUndefined: true,
      }).then(() => {
        console.log("yes");
        res.json({ msg: "success" });
      });
    }
  } else {
    res.status(401).json({ msg: "Admin access only" });
  }
});
//Delete User
router.delete("/:id", auth, (req, res) => {
  if (req.user.data.admin) {
    User.findByIdAndDelete(req.params.id).then(() =>
      res.json({ msg: "success" })
    );
  } else {
    res.status(401).json({ msg: "Admin access only" });
  }
});

module.exports = router;
