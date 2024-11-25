import { Request, Response } from 'express'
import { cookieOptions } from '~/config/cookie.config'
import logger from '~/config/winton.config'

export class ErrorResponseBase extends Error {
  constructor(
    public readonly message: string,
    public readonly status: number
  ) {
    super(message)
  }
}

export class SuccessResponseBase<T> {
  constructor(
    public readonly message: string,
    public readonly statusCode: number,
    public data: Partial<T>
  ) {}

  private logSuccess(req: Request) {
    logger.log(this.message, {
      context: 'Success Response',
      requestID: req.locals.requestID,
      ipAddress: req.locals.ipAddress,
      userId: req.userId,
      statusCode: this.statusCode,
      metaData: this.data,
      pathURL: req.originalUrl,
      body: req.body
    })
  }

  send(req: Request, res: Response) {
    this.logSuccess(req)
    res.status(this.statusCode).json(this)
  }

  setToken(res: Response, acessToken: string, refreshToken: string) {
    res.cookie('accessToken', acessToken, cookieOptions)
    res.cookie('refreshToken', refreshToken, cookieOptions)
    return this
  }

  clearToken(res: Response) {
    res.clearCookie('accessToken')
    res.clearCookie('refreshToken')
    return this
  }
}
