const express = require("express");
const List = require("../models/List");
const verifyToken = require("../utils/verifyToken");

const router = express.Router();

// CREATE
router.post("/", verifyToken, async (req, res) => {
  if (req.user.isAdmin) {
    const newList = new List(req.body);

    try {
      const savedList = await newList.save();

      res.status(201).json({
        code: 201,
        message: "Success",
        data: savedList,
      });
    } catch (error) {
      res.status(500).json({
        code: 500,
        message: error,
      });
    }
  } else {
    res.status(403).json({
      code: 403,
      message: "You are not allowed to perform this action!!!",
    });
  }
});

// GET
router.get("/", async (req, res) => {
  const typeQuery = req.query.type;
  const genreQuery = req.query.genre;

  let list = [];
  let currentPage;
  let total;

  try {
    if (typeQuery) {
      if (genreQuery) {
        total = await List.count({
          $match: { type: typeQuery, genre: genreQuery },
        });
        list = await List.aggregate([
          { $sample: { size: 10 } },
          { $match: { type: typeQuery, genre: genreQuery } },
        ]);
      } else {
        total = await List.count({
          $match: { type: typeQuery },
        });
        list = await List.aggregate([
          { $sample: { size: 10 } },
          { $match: { type: typeQuery } },
        ]);
      }
    } else {
      total = await List.count();
      list = await List.aggregate([{ $sample: { size: 10 } }]);
    }

    console.log(list);
    res.status(200).json({
      code: 200,
      message: "Success",
      data: {
        entries: list,
        total,
      },
    });
  } catch (error) {
    res.status(500).json({
      code: 500,
      message: error,
    });
  }
});

// DETELE
router.delete("/:id", verifyToken, async (req, res) => {
  if (req.user.isAdmin) {
    try {
      await List.findByIdAndDelete(req.params.id);

      res.status(200).json({
        code: 200,
        message: "Success",
      });
    } catch (error) {
      res.status(500).json({
        code: 500,
        message: error,
      });
    }
  } else {
    req.status(403).json({
      code: 403,
      message: "Your are not allowed perform this action!!!",
    });
  }
});

module.exports = router;
