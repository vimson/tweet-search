const redisBaseRepo = require('../repositories/redis.base.repo');

module.exports.checkCache = (options = {}) => {
  return async (req, res, next) => {
    res.set('Content-Type', 'application/json');
    res.set('Cache-Control', 'no-store');

    const cachedResponse = await redisBaseRepo.read(req.params.hashtag);
    if (cachedResponse) {
      return res.send(cachedResponse);
    } else {
      res.originalSendCallback = res.send;
      res.send = (body) => {
        res.originalSendCallback(body);
        redisBaseRepo.write(req.params.hashtag, body, { ttl: options.ttl });
      };
    }
    next();
  };
};
