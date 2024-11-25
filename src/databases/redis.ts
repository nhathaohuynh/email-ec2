import { createClient, RedisClientType } from 'redis'
import env from '~/config/env.config'

const STATUS_REDIS = {
  END: 'end',
  RECONNECT: 'reconnecting',
  ERROR: 'error'
}

class RedisDatabase {
  private static instance: RedisDatabase
  private client: RedisClientType | null

  private constructor() {
    this.client = createClient({ url: env.REDIS_URI })
    this.connect()
  }

  private connect(): void {
    if (!this.client) return

    this.setupEventHandler()
    this.client
      .connect()
      .then(() => {
        console.log('Redis connection status: connected')
      })
      .catch((err: unknown) => {
        console.error('Failed to connect to Redis:', err)
      })
  }

  private setupEventHandler(): void {
    if (!this.client) return

    this.client.on(STATUS_REDIS.END, () => {
      console.log('Redis connection status: ended')
    })

    this.client.on(STATUS_REDIS.ERROR, (err: Error) => {
      console.log('Redis connection status: error', err)
    })

    this.client.on(STATUS_REDIS.RECONNECT, () => {
      console.log('Redis connection status: reconnecting')
    })
  }

  static getClient(): RedisClientType {
    // Singleton pattern
    if (!this.instance) {
      this.instance = new RedisDatabase()
    }

    if (!this.instance.client) {
      throw new Error('Redis client is not initialized')
    }

    return this.instance.client
  }

  static async close(): Promise<void> {
    if (this.instance?.client) {
      await this.instance.client.quit()

      this.instance.client = null
      console.log('Redis client disconnected')
    }
  }
}

export default RedisDatabase
