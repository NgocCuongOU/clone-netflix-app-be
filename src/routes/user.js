const express = require("express");
const verifyAccessToken = require("../utils/verifyToken");
const crypto = require("crypto-js");
const User = require("../models/User");

const router = express.Router();

// Update
router.put("/:id", verifyAccessToken, async (req, res) => {
  if (req.user.id === req.params.id || req.user.isAdmin) {
    if (req.body.password) {
      const passwordEncrypted = crypto.AES.encrypt(
        req.body.password,
        process.env.SECRET_KEY
      ).toString();

      req.body.password = passwordEncrypted;
    }

    try {
      const updatedUser = await User.findByIdAndUpdate(
        req.params.id,
        {
          $set: req.body,
        },
        {
          new: true,
        }
      );

      res.status(200).json({
        statusCode: 200,
        message: "Success",
        data: updatedUser,
      });
    } catch (err) {
      res.status(500).json({ statusCode: 500, message: err });
    }
  } else {
    res
      .status(403)
      .json({ statusCode: 403, message: "You are not authorization!!!" });
  }
});

// Delete
router.delete("/:id", verifyAccessToken, async (req, res) => {
  if (req.user.id === req.params.id || req.user.isAdmin) {
    try {
      await User.findByIdAndDelete(req.params.id);

      res.status(200).json({
        statusCode: 200,
        message: "Success",
      });
    } catch (error) {
      res.status(500).json({
        statusCode: 500,
        message: error,
      });
    }
  } else {
    res.status(403).json({
      statusCode: 403,
      message: "You are not delete this account!!!",
    });
  }
});

// Get one
router.get("/find/:id", async (req, res) => {
  try {
    const user = await User.findById(req.params.id);

    const { password, ...restInfo } = user._doc;

    res.status(200).json({
      statusCode: 200,
      message: "Success",
      data: restInfo,
    });
  } catch (error) {
    res.status(500).json({
      statusCode: 500,
      message: error,
    });
  }
});

// Get all
router.get("/", verifyAccessToken, async (req, res) => {
  const query = req.query.new;

  if (req.user.isAdmin) {
    try {
      const users = query
        ? await User.find().sort({ _id: -1 }).limit(5)
        : await User.find();

      res.status(200).json({
        statusCode: 200,
        message: "Success",
        data: users,
      });
    } catch (error) {
      res.status(500).json({
        statusCode: 500,
        message: error,
      });
    }
  } else {
    res.status(403).json({
      statusCode: 403,
      message: "You are not allowed to see all users!!!",
    });
  }
});

// Get users stats
router.get("/stats", async (req, res) => {
  const today = new Date();
  const latYear = today.setFullYear(today.setFullYear() - 1);

  const monthsArray = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];

  try {
    const data = await User.aggregate([
      {
        $project: {
          month: { $month: "$createdAt" },
        },
      },
      {
        $group: {
          _id: "$month",
          total: { $sum: 1 },
        },
      },
    ]);

    res.status(200).json({
      statusCode: 200,
      message: "Success",
      data,
    });
  } catch (error) {
    res.status(500).json({
      statusCode: 500,
      message: error,
    });
  }
});

module.exports = router;
