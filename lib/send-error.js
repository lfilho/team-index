function sendError (res, err, message) {
  res.statusCode = err.statusCode || 500;
  res.end(message || err.message);
}

module.exports = sendError;
