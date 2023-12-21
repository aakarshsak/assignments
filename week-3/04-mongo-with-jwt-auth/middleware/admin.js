const jwt = require("jsonwebtoken");
const { JWT_PASSWORD, Admin } = require("../db");
const CustomError = require("../error/customError");

// Middleware for handling auth

async function adminMiddleware(req, res, next) {
  // Implement admin auth logic
  // You need to check the headers and validate the admin from the admin DB. Check readme for the exact headers to be expected
  try {
    const token = req.headers.authorization?.substring(7);
    const decode = jwt.verify(token, JWT_PASSWORD);
    if (!decode) {
      throw new Error();
    }

    await Admin.findOne({ username: decode.username });
  } catch (err) {
    err = new CustomError("Invalid credentials.", 401);
    next(err);
  }

  next();
}

module.exports = adminMiddleware;
