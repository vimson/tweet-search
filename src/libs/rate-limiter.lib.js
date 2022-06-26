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

  /**
   * @param {string} token
   * @returns
   */
  async status(token) {
    const requestLogs = await redisBaseRepo.read(this.cachePrefix + token);
    if (requestLogs === false) {
      this.logFirstRequest(token);
      return { status: 'OK', limit: this.maxWindowRequestCount };
    }

    const [currWindowStartTime, currLogWindowStartTime] = this.getWindowTimings(
      moment()
    );

    if (this.requestExceeded(requestLogs, currWindowStartTime)) {
      return {
        status: 'LIMIT_EXCEEDS',
        message: `You have exceeded ${this.maxWindowRequestCount} requests in ${this.windowSize} minutes limit!`,
        limit: this.maxWindowRequestCount,
      };
    }

    this.logSubsequentRequest(token, requestLogs, currLogWindowStartTime);
    return { status: 'OK', limit: this.maxWindowRequestCount };
  }

  async logFirstRequest(token) {
    const requestLogs = [];
    requestLogs.push({
      time: moment().unix(),
      counter: 1,
    });

    await redisBaseRepo.write(this.cachePrefix + token, requestLogs, 0);
    return true;
  }

  async logSubsequentRequest(token, requestLogs, currLogWindowStartTime) {
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
    return;
  }

  requestExceeded(requestLogs, currWindowStartTime) {
    const withinWindowRequests = requestLogs.filter((log) => {
      return log.time > currWindowStartTime;
    });
    const windowRequestCount = withinWindowRequests.reduce(
      (totalCount, log) => {
        return totalCount + log.counter;
      },
      0
    );
    return windowRequestCount >= this.maxWindowRequestCount ? true : false;
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
}

module.exports = new RateLimiter(
  process.env.RATE_Limit_WindowSize,
  process.env.RATE_Limit_MaxWindowRequestCount,
  process.env.RATE_Limit_WindowLogInterval
);
