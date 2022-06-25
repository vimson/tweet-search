const { setUp } = require('./setup');
setUp();
const redisBaseRepo = require('../repositories/redis.base.repo');
const tweetsService = require('../services/tweets.service');
const tweets = require('./data/tweets');
const hashTag = 'London';

describe('Redis Base repo', () => {
  it('Case1: Writing to the cache & verifying the value', async (done) => {
    await redisBaseRepo.write(hashTag, tweets, 60 * 60 * 2);
    const value = await redisBaseRepo.read(hashTag);
    expect(value).toEqual(tweets);
    done();
  });

  it('Case2: Reading from the cache', async (done) => {
    const value = await redisBaseRepo.read(hashTag);
    expect(value).toEqual(tweets);
    done();
  });
});
