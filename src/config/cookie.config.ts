import { CookieOptions } from 'express'
import ms from 'ms'

export const cookieOptions: CookieOptions = {
  httpOnly: true,
  secure: true,
  sameSite: 'lax',
  maxAge: ms('7 days')
}
