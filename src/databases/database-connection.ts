import mongoose from 'mongoose'
import env from '~/config/env.config'
import { InternalServerError } from '~/utils/error-response.util'

export class Database {
  private static instance: Database
  private readonly uri: string
  private readonly dbName: string

  private constructor() {
    this.uri = env.DB_URI
    this.dbName = env.DB_NAME
  }

  static getInstance(): Database {
    if (!Database.instance) {
      Database.instance = new Database()
    }
    return Database.instance
  }

  async connect(): Promise<void> {
    if (mongoose.connection.readyState === 1) {
      return
    }

    try {
      await mongoose.connect(this.uri, {
        dbName: this.dbName,
        serverApi: { version: '1', strict: true, deprecationErrors: true }
      })
      console.log(`Connected to the database: ${this.dbName}`)
    } catch (err) {
      console.error('Failed to connect to the database:', err)
      throw new InternalServerError('Database connection failed')
    }
  }

  getDatabase() {
    if (mongoose.connection.readyState !== 1) {
      throw new InternalServerError('Database is not connected')
    }
    return mongoose.connection.db
  }

  async close(): Promise<void> {
    if (mongoose.connection.readyState !== 0) {
      await mongoose.disconnect()
      console.log('Disconnected from the database')
    }
  }
}

const dbInstance = Database.getInstance()

export { dbInstance }
