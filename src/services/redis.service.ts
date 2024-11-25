import ms from 'ms'
import { RedisClientType } from 'redis'
import RedisDatabase from '~/databases/redis'

class RedisService {
  private instance: RedisClientType
  constructor() {
    this.instance = RedisDatabase.getClient()
  }

  async setTokenToRedis(key: string, token: string, ttl: number = ms('10m')) {
    const redisKey = `two-step-verification:${key}`
    await this.instance.set(redisKey, token, { EX: ttl })
  }

  async getTokenFromRedis(key: string) {
    const redisKey = `two-step-verification:${key}`
    return await this.instance.get(redisKey)
  }
}

export default new RedisService()
