const router = require('express').Router();
const TweetsController = require('../controllers/tweets.controller');
const { checkCache } = require('../middlewares/cachemanager.middleware');
const { apiRateLimiter } = require('../middlewares/rate-limiter.middleware');

router.get(
  '/tweets/:hashtag',
  apiRateLimiter,
  checkCache({ ttl: 60 * 60 }),
  TweetsController.search
);

module.exports = router;
