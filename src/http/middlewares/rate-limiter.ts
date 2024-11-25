/* eslint-disable @typescript-eslint/no-unused-vars */
import { NextFunction, Request, Response } from 'express'
import RedisDatabase from '~/databases/redis'
import { MAX_REQUESTS, WINDOW_SIZE_IN_SECONDS } from '~/utils/constant.util'
import { InternalServerError, TooManyRequest } from '~/utils/error-response.util'

export const rateLimiter = async (req: Request, res: Response, next: NextFunction) => {
  const clientIp = req.ip

  if (!clientIp) {
    return next(new InternalServerError())
  }
  // transaction in redis
  const redisClient = RedisDatabase.getClient()

  const pipeline = redisClient.multi()
  // increment the key value
  pipeline.incr(clientIp)
  pipeline.expire(clientIp, WINDOW_SIZE_IN_SECONDS)

  const [currentValue, _] = (await pipeline.exec()) as [number, number]

  if (currentValue > MAX_REQUESTS) {
    return next(new TooManyRequest())
  }

  next()
}
