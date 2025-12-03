/** @format */

const notFound = (req, res, next) => {
  const error = new Error(`Not-Found - ${req.originalUrl}`);
  res.status(404);
  next(error);
};

function errorHandler(error, req, res, next) {
 console.error(error)
  const statusCode = res.statusCode === 200 ? 500 : res.statusCode;
  res.status(statusCode).json({ message: error.message });
}

module.exports = {
  notFound,
  errorHandler,
};
