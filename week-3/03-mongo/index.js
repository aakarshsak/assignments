const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const app = express();
const adminRouter = require("./routes/admin");
const userRouter = require("./routes/user");

const exceptionHandler = require("./middleware/exceptionHandler");
const { response } = require("express");

mongoose
  .connect("mongodb://127.0.0.1:27017/cohort2")
  .then(() => console.log("Connected to db..."))
  .catch((err) => console.log("Error connecting to db..."));

// Middleware for parsing request bodies
app.use(bodyParser.json());
app.use("/admin", adminRouter);
app.use("/user", userRouter);

app.use(exceptionHandler);

const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
