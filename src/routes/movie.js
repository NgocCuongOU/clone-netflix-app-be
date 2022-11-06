const mongoose = require("mongoose");
const Movie = require("../models/Movie");
const verifyToken = require("../utils/verifyToken");
const express = require("express");

const router = express.Router();

// CREATE
router.post("/", verifyToken, async (req, res) => {
  if (req.user.isAdmin) {
    const newMovie = new Movie(req.body);

    try {
      const savedMovie = await newMovie.save();

      res.status(201).json({
        code: 201,
        message: "Success",
        data: savedMovie,
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
      message: "You are not allowed to create movie!!!",
    });
  }
});

// UPDATE BY ID
router.put("/:id", verifyToken, async (req, res) => {
  if (req.user.isAdmin) {
    try {
      const updatedMovie = await Movie.findByIdAndUpdate(
        req.params.id,
        {
          $set: req.body,
        },
        {
          new: true,
        }
      );

      res.status(200).json({
        code: 200,
        message: "Success",
        data: updatedMovie,
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
      message: "You are not allowed to perform action!!!",
    });
  }
});

// DELETE A MOVIE
router.delete("/:id", verifyToken, async (req, res) => {
  if (req.user.isAdmin) {
    await Movie.findByIdAndDelete(req.params.id);

    res.status(200).json({
      code: 200,
      message: "Success",
    });
  } else {
    res.status(403).json({
      code: 403,
      message: "You are not allowed to perform this action!!!",
    });
  }
});

// GET ONE
router.get("/find/:id", async (req, res) => {
  try {
    const movie = await Movie.findById(req.params.id);

    res.status(200).json({
      code: 200,
      message: "Success",
      data: movie,
    });
  } catch (error) {
    res.status(500).json({
      code: 500,
      message: error,
    });
  }
});

// GET ALL
router.get("/", verifyToken, async (req, res) => {
  if (req.user.isAdmin) {
    try {
      const listMovie = await Movie.find().sort({ _id: -1 }).limit(10);

      res.status(200).json({
        code: 200,
        message: "Success",
        data: listMovie,
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

// GET RANDOM MOVIE
router.get("/random", async (req, res) => {
  const type = req.query.type;
  let movie;

  try {
    if (type === "series") {
      movie = await Movie.aggregate([
        {
          $match: { isSeries: true },
        },
        {
          $sample: { size: 2 },
        },
      ]);
    } else {
      movie = await Movie.aggregate([
        {
          $match: { isSeries: false },
        },
        {
          $sample: { size: 1 },
        },
      ]);
    }

    res.status(200).json({
      code: 200,
      message: "Success",
      data: movie,
    });
  } catch (error) {
    res.status(500).json({
      code: 500,
      message: error,
    });
  }
});

module.exports = router;
