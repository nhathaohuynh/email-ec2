import cookieParser from 'cookie-parser'
import cors from 'cors'
import express, { Express } from 'express'
import helmet from 'helmet'
import morgan from 'morgan'
import { corsOptions } from './config/cros.config'
import env from './config/env.config'
import { errorHandler } from './http/middlewares/error-handler'
import { loggerRequest } from './http/middlewares/logger'
import { notFound } from './http/middlewares/not-found'
import { preventCaching } from './http/middlewares/prevent-caching'
import { rateLimiter } from './http/middlewares/rate-limiter'
import router from './http/routes'
import { ROUTE_APP } from './http/routes/route-config-app'
import { API_PREFIX } from './utils/constant.util'
import { routeApp } from './utils/route-app.util'

export const expressApp = (app: Express) => {
  // middleware
  app.use(helmet())
  app.use(express.json())
  app.use(express.urlencoded({ extended: true }))
  app.use(morgan('dev'))
  app.use(cors(corsOptions))
  app.use(cookieParser(env.COOKIE_SECRET))
  app.use(preventCaching)
  app.use(rateLimiter)
  app.use(loggerRequest)
  app.use(API_PREFIX, router)
  app.use(notFound)
  app.use(errorHandler)

  routeApp(ROUTE_APP, API_PREFIX)
}
