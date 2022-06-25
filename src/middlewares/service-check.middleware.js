const redisBaseRepo = require('../repositories/redis.base.repo');

module.exports.dbAvailability = (req, res, next) => {
  if (!redisBaseRepo.isReady) {
    const err = new Error('We are sorry. Some services are not available now!');
    err.status = 503;
    return next(err);
  }
  next();
};
