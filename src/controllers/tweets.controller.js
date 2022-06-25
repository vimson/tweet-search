const tweetsService = require('../services/tweets.service');

class TweetsController {
  async search(request, response, next) {
    const tweets = await tweetsService
      .search(request.params.hashtag)
      .catch((err) => {});
    response.json({
      lastFetched: new Date().toISOString(),
      tweets: tweets,
    });
    next();
  }
}

module.exports = new TweetsController();
