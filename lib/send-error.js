function sendError (res, err, message) {
  console.error(err);
  console.error(err.stack);

  res.statusCode = 500;
  res.end(message || err.message);
}

module.exports = sendError;
