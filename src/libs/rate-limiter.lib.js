const moment = require('moment');
const redisBaseRepo = require('../repositories/redis.base.repo');

class RateLimiter {
  cachePrefix = 'request_logs_';
  windowSize;
  windowLogInterval;
  maxWindowRequestCount;

  /**
   * @param {number} windowSize - in Minutes, Time frame for which requests are checked
   * @param {number} maxWindowRequestCount - Maximum number of requests allowed
   * @param {number} windowLogInterval - in Minutes, grouping request logs based on this time window
   */
  constructor(windowSize, maxWindowRequestCount, windowLogInterval) {
    this.windowSize = windowSize;
    this.windowLogInterval = windowLogInterval;
    this.maxWindowRequestCount = maxWindowRequestCount;
  }

  async status(token) {
    const requestLogs = await redisBaseRepo.read(this.cachePrefix + token);
    if (requestLogs === false) {
      this.createTokenLimitRecord(token);
      return { status: 'OK', limit: this.maxWindowRequestCount };
    }

    const currentRequestTime = moment();
    const [currWindowStartTime, currLogWindowStartTime] =
      this.getWindowTimings(currentRequestTime);
    const withinWindowRequests = requestLogs.filter((log) => {
      return log.time > currWindowStartTime;
    });
    const windowRequestCount = withinWindowRequests.reduce(
      (totalCount, log) => {
        return totalCount + log.counter;
      },
      0
    );

    if (windowRequestCount >= this.maxWindowRequestCount) {
      return {
        status: 'LIMIT_EXCEEDS',
        message: `You have exceeded ${this.maxWindowRequestCount} requests in ${this.windowSize} minutes limit!`,
        limit: this.maxWindowRequestCount,
      };
    }

    const lastRequestLog = requestLogs[requestLogs.length - 1];
    if (lastRequestLog.time > currLogWindowStartTime) {
      lastRequestLog.counter++;
      requestLogs[requestLogs.length - 1] = lastRequestLog;
    } else {
      requestLogs.push({
        time: moment().unix(),
        counter: 1,
      });
    }
    await redisBaseRepo.write(this.cachePrefix + token, requestLogs, 0);
    return { status: 'OK', limit: this.maxWindowRequestCount };
  }

  getWindowTimings(currentRequestTime) {
    const currWindowStartTime = moment()
      .subtract(this.windowSize, 'minutes')
      .unix();

    const currLogWindowStartTime = currentRequestTime
      .subtract(this.windowLogInterval, 'minutes')
      .unix();

    return [currWindowStartTime, currLogWindowStartTime];
  }

  async createTokenLimitRecord(token) {
    const requestLogs = [];
    requestLogs.push({
      time: moment().unix(),
      counter: 1,
    });

    await redisBaseRepo.write(this.cachePrefix + token, requestLogs, 0);
    return true;
  }
}

module.exports = new RateLimiter(
  process.env.RATE_Limit_WindowSize,
  process.env.RATE_Limit_MaxWindowRequestCount,
  process.env.RATE_Limit_WindowLogInterval
);
