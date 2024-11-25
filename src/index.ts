import exitAppHook from 'async-exit-hook'
import express from 'express'
import 'reflect-metadata'
import { expressApp } from './app'
import env from './config/env.config'
import { dbInstance } from './databases/database-connection'

const app = express()

const StartServer = async () => {
  app.listen(env.APP_PORT, () => {
    console.log(`Server is running on port ${env.APP_PORT}`)
  })

  expressApp(app)

  exitAppHook(async () => {
    await dbInstance.close()
  })
}

;(async () => {
  try {
    await dbInstance.connect()
    await StartServer()
  } catch (error) {
    console.error('Failed to start the server:', error)
    process.exit(1)
  }
})()
