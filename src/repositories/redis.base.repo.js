const redis = require('redis');
const stringify = require('json-stringify-safe');

class RedisBaseRepository {
  client = null;
  isReady = false;

  constructor() {
    this.client = redis.createClient({
      url: `redis://${process.env.Redis_Host}:${process.env.Redis_Port}`,
      enable_offline_queue: false,
    });

    this.client.on('connect', () => {
      this.isReady = true;
    });
  }

  async connect() {
    try {
      await this.client.connect();
    } catch (err) {
      console.log(
        `Error: verify Redis cluster is running redis://${process.env.Redis_Host}:${process.env.Redis_Port}`
      );
    }
  }

  async write(key, value, options = { ttl: 60 }) {
    const encodedValue = this.encode(value);
    await this.client.set(key, encodedValue);
    if (options?.ttl) {
      await this.client.expire(key, options.ttl);
    }
    return true;
  }

  async read(key) {
    const value = await this.client.get(key);
    return value ? this.decode(value) : false;
  }

  async del(key) {
    return await this.client.del(key);
  }

  encode(value) {
    return stringify(value);
  }

  decode(value) {
    return JSON.parse(value);
  }
}

const redisBaseRepo = new RedisBaseRepository();
redisBaseRepo.connect();
module.exports = redisBaseRepo;
