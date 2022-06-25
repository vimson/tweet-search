module.exports.logErrors = (err, req, res, next) => {
  console.error(err.message);
  console.error(err.stack);
  next(err);
};

module.exports.clientErrorHandler = (err, req, res, next) => {
  if (req.xhr) {
    res.status(500).json({ error: 'Something failed!' });
  } else {
    next(err);
  }
};

module.exports.errorHandler = (err, req, res, next) => {
  res.status(err.status ?? 500).json({
    message: err.message,
  });
};

module.exports.resourceNotFound = (req, res) => {
  if (!res.headersSent) {
    res.status(404).json({
      message: 'Requested resource not found!',
    });
  }
};
