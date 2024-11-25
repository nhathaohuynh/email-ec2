/* eslint-disable @typescript-eslint/no-unused-vars */
import { NextFunction, Request, Response } from 'express'
import { env } from 'process'
import logger from '~/config/winton.config'
import { ErrorResponseBase } from '~/utils/response.util'

export const errorHandler = (err: Error, req: Request, res: Response, _: NextFunction) => {
  const statusCode = err instanceof ErrorResponseBase ? err.status : 500
  const message = err.message || 'Internal Server Error'

  const responseData: {
    status: number
    message: string
    path?: string
    stack?: string
  } = {
    status: statusCode,
    message,
    path: req.originalUrl,
    stack: err.stack
  }

  logger.error(message, {
    context: 'Error Response',
    statusCode,
    requestID: req.locals.requestID,
    pathURL: req.originalUrl,
    userId: req.userId,
    ipAddress: req.locals.ipAddress,
    body: req.body
  })

  if (env.BUILD_MODE === 'production') {
    responseData.path = undefined
    responseData.stack = undefined
  }

  res.status(statusCode).json(responseData)
}
