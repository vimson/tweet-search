const { setUp } = require('./setup');
setUp();
const rateLimiter = require('../libs/rate-limiter.lib');
const tweetsService = require('../services/tweets.service');
const redisBaseRepo = require('../repositories/redis.base.repo');

describe('Twitter API testing', () => {
  test('Case1: Fetching tweets', async (done) => {
    const tweets = await tweetsService.search('London');
    expect(tweets.length).toBeGreaterThan(0);
    done();
  });

  test('Case2: Testing rate limit', async (done) => {
    const testToken = 'mU7JJsnnsNYTSNLAJmnbsjT';
    await redisBaseRepo.del(`request_logs_${testToken}`);

    // We have modified the max window count to 5. so after 5 requests, the next request i going to be with Limit exceeds message
    let limitStatus = {};
    limitStatus = await rateLimiter.status(testToken);
    expect(limitStatus.status).toBe('OK');
    limitStatus = await rateLimiter.status(testToken);
    expect(limitStatus.status).toBe('OK');
    limitStatus = await rateLimiter.status(testToken);
    expect(limitStatus.status).toBe('OK');
    limitStatus = await rateLimiter.status(testToken);
    expect(limitStatus.status).toBe('OK');
    limitStatus = await rateLimiter.status(testToken);
    expect(limitStatus.status).toBe('OK');
    limitStatus = await rateLimiter.status(testToken);
    expect(limitStatus.status).toBe('LIMIT_EXCEEDS');
    done();
  });
});
