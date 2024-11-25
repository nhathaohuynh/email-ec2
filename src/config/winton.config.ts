/* eslint-disable @typescript-eslint/no-explicit-any */
import { createLogger, format, transports, Logger as WinstonLogger } from 'winston'
import 'winston-daily-rotate-file'

interface LogParams {
  context?: string
  requestID?: string
  metaData?: Record<string, any>
  statusCode?: number
  pathURL?: string | undefined
  body?: string
  userId?: string
  ipAddress?: string
}

class Logger {
  private logger: WinstonLogger

  constructor() {
    const formatPrint = format.printf(
      ({
        level,
        message,
        statusCode,
        context,
        requestID,
        timestamp,
        metaData,
        userId,
        ipAddress,
        pathURL,
        body
      }: any) => {
        return (
          `${timestamp} [${level}] - RequestID: ${requestID} - Path: ${pathURL} - Body: ${JSON.stringify(body)} - StatusCode: ${statusCode} - Context: ${context} - Message: "${message}" - ` +
          `UserID: ${userId || 'N/A'} - IP: ${ipAddress || 'N/A'} ` +
          (metaData ? `- MetaData: ${JSON.stringify(metaData)}` : '')
        )
      }
    )

    this.logger = createLogger({
      format: format.combine(format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }), formatPrint),
      transports: [
        new transports.Console(),
        new transports.DailyRotateFile({
          level: 'info',
          dirname: 'src/logs',
          filename: '%DATE%.info.log',
          datePattern: 'YYYY-MM-DD',
          zippedArchive: true,
          maxSize: '20m',
          maxFiles: '1d',
          format: format.combine(format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }), formatPrint)
        }),
        new transports.DailyRotateFile({
          level: 'error',
          dirname: 'src/logs',
          filename: '%DATE%.error.log',
          datePattern: 'YYYY-MM-DD',
          zippedArchive: true,
          maxSize: '20m',
          maxFiles: '1d',
          format: format.combine(format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }), formatPrint)
        })
      ]
    })
  }

  // Helper function to standardize log parameters
  private commonParams(params: LogParams | [string, string?, Record<string, any>?]): LogParams {
    let context: string | undefined
    let requestID: string | undefined
    let metaData: Record<string, any> | undefined
    let statusCode: number | undefined
    let userId: string | undefined
    let ipAddress: string | undefined
    let pathURL: string | undefined
    let body: string | undefined

    if (Array.isArray(params)) {
      ;[context, requestID, metaData] = params
    } else {
      ;({ context, requestID, metaData, userId, ipAddress, statusCode, pathURL, body } = params)
    }

    return {
      requestID: requestID || 'unknown',
      context,
      metaData,
      userId,
      ipAddress,
      statusCode,
      pathURL,
      body
    }
  }

  log(message: string, params?: LogParams | [string, string?, Record<string, any>?]): void {
    const paramsLog = this.commonParams((params as LogParams) || [])
    const logObject = {
      message,
      ...paramsLog
    }

    this.logger.info(logObject)
  }

  // Log errors with additional parameters
  error(message: string, params?: LogParams | [string, string?, Record<string, any>?]): void {
    const paramsLog = this.commonParams((params as LogParams) || [])
    const logObject = {
      message,
      ...paramsLog
    }

    this.logger.error(logObject)
  }
}

export default new Logger()
