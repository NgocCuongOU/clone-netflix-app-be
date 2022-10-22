const express = require("express");
const app = new express();
const mongoose = require("mongoose");
const dotenv = require("dotenv");

dotenv.config();

mongoose
  .connect(process.env.MONGO_URL)
  .then(() => console.log("Database connection successfully!!!"))
  .catch((error) => console.log(error));

app.listen(8800, () => {
  console.log("Backend is running on localhost:8800");
});
