import { NextFunction, Request, Response } from 'express'
import { v4 as uuidv4 } from 'uuid'
import logger from '~/config/winton.config'

export const loggerRequest = (req: Request, res: Response, next: NextFunction) => {
  const requestID = uuidv4()
  console.log(requestID)
  const userId = req.header('x-user-id') || 'unknown'
  const ipAddress = req.ip || 'unkown'

  // Attach request ID to request and log initial request data
  req.locals = { requestID, userId, ipAddress }
  logger.log('Incoming request', {
    context: 'Request',
    requestID,
    userId,
    ipAddress,
    pathURL: req.originalUrl,
    body: req.body
  })
  next()
}
