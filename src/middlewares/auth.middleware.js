module.exports.checkAuth = (req, res, next) => {
  const APIToken = req.header('API_Token');
  if (!APIToken || APIToken !== process.env.REST_API_Token) {
    const err = new Error('Not authorized!');
    err.status = 401;
    return next(err);
  }
  next();
};
