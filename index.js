const express = require("express");
const app = new express();
const mongoose = require("mongoose");
const dotenv = require("dotenv");

const authRouter = require("./src/routes/auth");
const userRouter = require("./src/routes/user");
const movieRouter = require("./src/routes/movie");
const listRouter = require("./src/routes/list");

dotenv.config();

mongoose
  .connect(process.env.MONGO_URL)
  .then(() => console.log("Database connection successfully!!!"))
  .catch((error) => console.log("Database connection error :>>>", error));

app.use(express.json());

app.use("/api/auth", authRouter);
app.use("/api/users", userRouter);
app.use("/api/movies", movieRouter);
app.use("/api/list", listRouter);

app.listen(8800, () => {
  console.log("Backend is running on localhost:8800");
});
