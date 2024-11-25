import { NextFunction, Request, Response } from 'express'

export const preventCaching = (req: Request, res: Response, next: NextFunction) => {
  res.set('Cache-Control', 'no-store')
  res.set('Pragma', 'no-cache')
  res.set('Expires', '0')
  next()
}
