const { setUp } = require('./setup');
setUp();
const redisBaseRepo = require('../repositories/redis.base.repo');
const tweetsService = require('../services/tweets.service');

describe('Redis Base repo', () => {
  it('Case1: Writing to cache', async (done) => {
    const hashTag = 'London';
    const tweets = await tweetsService.search(hashTag);
    await redisBaseRepo.write(hashTag, tweets, 60 * 60 * 2);
    done();
  });

  it('Case2: Reading from cache', async (done) => {
    const hashTag = 'London';
    const value = await redisBaseRepo.read(hashTag);
    console.log(value);
    done();
  });
});
