const jwt = require("jsonwebtoken");
const { JWT_PASSWORD, User } = require("../db");
const CustomError = require("../error/customError");

async function userMiddleware(req, res, next) {
  // Implement user auth logic
  // You need to check the headers and validate the user from the user DB. Check readme for the exact headers to be expected
  try {
    const token = req.headers.authorization?.substring(7);
    const decode = jwt.verify(token, JWT_PASSWORD);
    if (!decode) {
      throw new Error();
    }

    const user = await User.findOne({ username: decode.username });
    req.user = user;
  } catch (err) {
    err = new CustomError("Invalid credentials.", 401);
    next(err);
  }

  next();
}

module.exports = userMiddleware;
