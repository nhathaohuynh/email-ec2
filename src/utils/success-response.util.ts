import { ReasonPhrases } from './reason-phrases'
import { SuccessResponseBase } from './response.util'
import { StatusCodes } from './status-code.util'

export class CreatedResponse<T> extends SuccessResponseBase<T> {
  constructor(data: T, message = ReasonPhrases.CREATED, status = StatusCodes.CREATED) {
    super(message, status, data)
  }
}

export class OKResponse<T> extends SuccessResponseBase<T> {
  constructor(data: T, message = ReasonPhrases.OK, status = StatusCodes.OK) {
    super(message, status, data)
  }
}

export class NoContentResponse extends SuccessResponseBase<null> {
  constructor(message = ReasonPhrases.NO_CONTENT, status = StatusCodes.NO_CONTENT) {
    super(message, status, null)
  }
}
