const { setUp } = require('./setup');
setUp();
const tweetsService = require('../services/tweets.service');

describe('Twitter API testing', () => {
  it('Case1: Fetching tweets', async (done) => {
    //console.log(process.env);
    const tweets = await tweetsService.search('London');
    done();
  });
});
