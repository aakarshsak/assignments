const exceptionHandler = (err, req, res, next) => {
  res
    .status(err.statusCode)
    .send({ type: "error", status: err.statusCode, message: err.message });
  next();
};

module.exports = exceptionHandler;
