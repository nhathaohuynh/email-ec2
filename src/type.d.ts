/* eslint-disable @typescript-eslint/no-unused-vars */

import express from 'express'
declare global {
  namespace Express {
    interface Request {
      userId: string
      mail_address: string
      locals: {
        requestID: string
        userId: string
        ipAddress: string
      }
    }
  }
}
