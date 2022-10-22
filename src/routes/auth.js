const express = require("express");
const crypto = require("crypto-js");
const jwt = require("jsonwebtoken");
const User = require("../models/User");

const router = express.Router();

// Register
router.post("/register", async (req, res) => {
  const newUser = new User({
    username: req.body.username,
    email: req.body.email,
    password: crypto.AES.encrypt(
      req.body.password,
      process.env.SECRET_KEY
    ).toString(),
  });

  console.log("New user :>>", newUser);

  try {
    const user = await newUser.save();

    res.status(201);
    res.json(user);
  } catch (err) {
    res.status(500);
    res.json(err);
  }
});

// Login
router.post("/login", async (req, res) => {
  try {
    const user = await User.findOne({ email: req.body.email });

    !user &&
      res
        .status(401)
        .json("Something went wrong!!! - Wrong username or password!!!");

    const passwordDecypted = crypto.AES.decrypt(
      user.password,
      process.env.SECRET_KEY
    );
    const originalPass = passwordDecypted.toString(crypto.enc.Utf8);

    if (originalPass !== req.body.password) {
      res.status(401).json("Wrong username or password!!!");
    }

    const accessToken = jwt.sign(
      { id: user._id, isAdmin: user.isAdmin },
      process.env.SECRET_KEY,
      { expiresIn: "5d" }
    );

    const { password, ...restInfo } = user._doc;

    res.status(200).json({ ...restInfo, accessToken });
  } catch (err) {
    res.status(500).json("Request has error :>>>", err);
  }
});

module.exports = router;
