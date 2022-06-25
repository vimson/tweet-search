const Twit = require('twit');
const { makeTweetFromStatus } = require('../factories/tweets.factory');
const tweetResults = require('../tests/data/tweets');
class TweetsService {
  twitObj = null;

  constructor() {
    this.twitObj = new Twit({
      consumer_key: process.env.Twitter_API_Key,
      consumer_secret: process.env.Twitter_API_Key_Secret,
      access_token: process.env.Twitter_Access_Token,
      access_token_secret: process.env.Twitter_Access_Token_Secret,
      timeout_ms: 60 * 1000,
      strictSSL: true,
    });
  }

  async search(hashTag) {
    try {
      // const tweetResults = await this.twitObj.get('search/tweets', {
      //   q: `#${hashTag}`,
      //   count: process.env.Twitter_Search_Record_Count,
      // });
      if (!tweetResults?.data?.statuses) {
        return [];
      }
      const tweets = tweetResults.data.statuses.map((tweet) => {
        return makeTweetFromStatus(tweet);
      });
      return tweets;
    } catch (err) {
      console.log(err);
      return [];
    }
  }
}

module.exports = new TweetsService();
