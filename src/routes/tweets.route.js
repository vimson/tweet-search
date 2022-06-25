const router = require('express').Router();
const TweetsController = require('../controllers/tweets.controller');
const { checkCache } = require('../middlewares/cachemanager.middleware');
const { apiRateLimiter } = require('../middlewares/rate-limiter.middleware');

router.get(
  '/tweets/:hashtag',
  apiRateLimiter,
  checkCache({ ttl: process.env.Tweet_Cache_Interval }),
  TweetsController.search
);

module.exports = router;
