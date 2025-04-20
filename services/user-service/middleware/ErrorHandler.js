const errorHandler = (err, req, res, next) => {
  // err -> property contains the error that has been thrown
  const statusCode = res.statusCode == 200 ? 401 : res.statusCode;
  res.status(statusCode);
  res.json({
    message: err.message,
    stack: err.stack, //stack contain the file that the error is going to be occurred
  });
};
module.exports = errorHandler;
