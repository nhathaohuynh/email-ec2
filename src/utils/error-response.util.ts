/* eslint-disable @typescript-eslint/no-explicit-any */
import { ReasonPhrases } from './reason-phrases'
import { ErrorResponseBase } from './response.util'
import { StatusCodes } from './status-code.util'

export class BadRequest extends ErrorResponseBase {
  constructor(message: any = ReasonPhrases.BAD_REQUEST, status = StatusCodes.BAD_REQUEST) {
    super(JSON.stringify(message), status)
  }
}

export class ConflictError extends ErrorResponseBase {
  constructor(message: any = ReasonPhrases.CONFLICT, status = StatusCodes.CONFLICT) {
    super(JSON.stringify(message), status)
  }
}

export class InternalServerError extends ErrorResponseBase {
  constructor(message: any = ReasonPhrases.INTERNAL_SERVER_ERROR, status = StatusCodes.INTERNAL_SERVER_ERROR) {
    super(message, status)
  }
}

export class ForbiddenError extends ErrorResponseBase {
  constructor(message: any = ReasonPhrases.FORBIDDEN, status = StatusCodes.FORBIDDEN) {
    super(JSON.stringify(message), status)
  }
}

export class UnauthorizedError extends ErrorResponseBase {
  constructor(message: any = ReasonPhrases.UNAUTHORIZED, status = StatusCodes.UNAUTHORIZED) {
    super(JSON.stringify(message), status)
  }
}

export class TooManyRequest extends ErrorResponseBase {
  constructor(message: any = ReasonPhrases.TOO_MANY_REQUESTS, status = StatusCodes.TOO_MANY_REQUESTS) {
    super(JSON.stringify(message), status)
  }
}

export class NotFoundError extends ErrorResponseBase {
  constructor(message: any = ReasonPhrases.NOT_FOUND, status = StatusCodes.NOT_FOUND) {
    super(JSON.stringify(message), status)
  }
}

export class UnprocessableError extends ErrorResponseBase {
  constructor(message: any = ReasonPhrases.UNPROCESSABLE_ENTITY, status = StatusCodes.UNPROCESSABLE_ENTITY) {
    super(JSON.stringify(message), status)
  }
}

export class NotAcceptable extends ErrorResponseBase {
  constructor(message: any = ReasonPhrases.NOT_ACCEPTABLE, status = StatusCodes.NOT_ACCEPTABLE) {
    super(JSON.stringify(message), status)
  }
}

export class GoneError extends ErrorResponseBase {
  constructor(message: any = ReasonPhrases.GONE, status = StatusCodes.GONE) {
    super(JSON.stringify(message), status)
  }
}
