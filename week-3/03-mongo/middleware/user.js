const { User } = require("../db");

async function userMiddleware(req, res, next) {
  // Implement user auth logic
  // You need to check the headers and validate the user from the user DB. Check readme for the exact headers to be expected
  const username = req.headers.username;
  const password = req.headers.password;

  try {
    const user = await User.findOne({ username, password });
    if (!user) {
      res
        .status(401)
        .send({ type: "error", status: 401, message: "Invalid credentials" });
      return;
    }
    req.user = user;
  } catch (err) {
    throw new Error();
  }
  next();
}

module.exports = userMiddleware;
