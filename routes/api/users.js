const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const passport = require("passport");

//load user model
const User = require("../../models/User");

router.get("/test", (req, res) => res.json({ msg: "Users works" }));

//@route  GET api/users/register
//@desc   Register user
//@access Public
router.post("/register", (req, res) => {
  User.findOne({ email: req.body.email }).then(user => {
    if (user) {
      return res.status(400).json({ email: "Email already exists" });
    } else {
      const newUser = new User({
        name: req.body.name,
        email: req.body.email,
        password: req.body.password
      });

      bcrypt.genSalt(10, (err, salt) => {
        bcrypt.hash(newUser.password, salt, (err, hash) => {
          if (err) throw err;
          newUser.password = hash;
          newUser
            .save()
            .then(user => res.json(user))
            .catch(err => console.log(err));
        });
      });
    }
  });
});

//@route  GET api/users/login
//@desc   login user / Return JWT token
//@access Public
router.post("/login", (req, res) => {
  const email = req.body.email;
  const password = req.body.password;

  //Find user by email
  User.findOne({ email }).then(user => {
    //Check for user
    if (!user) {
      return res.status(404).json({ email: "User  not found" });
    }

    bcrypt.compare(password, user.password).then(isMatch => {
      if (isMatch) {
        //user matched

        //jwt payload
        const payload = { id: user.id, name: user.name };

        //sign token
        jwt.sign(
          payload,
          keys.secretKey,
          { expiresIn: 86400 },
          (err, token) => {
            res.json({
              success: true,
              token: "Bearer " + token
            });
          }
        );
      } else {
        return res.status(400).json({ error: "password not found." });
      }
    });
  });
});

//@route  GET api/users/current
//@desc   Return current user
//@access private
router.get(
  "/current",
  passport.authenticate("jwt", { session: flase }),
  (req, res) => {
    res.json({ msg: " Success" });
  }
);

module.exports = router;
