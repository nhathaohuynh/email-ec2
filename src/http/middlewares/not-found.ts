import { NextFunction, Request, Response } from 'express'
import { NotFoundError } from '~/utils/error-response.util'

export const notFound = (req: Request, res: Response, next: NextFunction) => {
  const error = new NotFoundError()
  next(error)
}
