const rateLimiter = require('../libs/rate-limiter.lib');

// As per the limits imposed by Twitter (https://developer.twitter.com/en/docs/twitter-api/rate-limits)
// 450 requests / 15 mins PER APP | 100 results per response

module.exports.apiRateLimiter = async (req, res, next) => {
  const limitStatus = await rateLimiter.status(req.header('API_Token'));

  res.set('X-RateLimit-Limit', limitStatus.limit);
  if (limitStatus.status === 'LIMIT_EXCEEDS') {
    const err = new Error(limitStatus.message);
    err.status = 429;
    return next(err);
  }
  next();
};
