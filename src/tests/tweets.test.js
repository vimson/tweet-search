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
