const exceptionHandler = (err, req, res, next) => {
  res
    .status(500)
    .send({ type: "error", status: 500, message: "Internal server error" });
  next();
};

module.exports = exceptionHandler;
