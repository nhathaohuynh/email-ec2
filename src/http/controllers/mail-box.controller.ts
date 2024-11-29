import { Request, Response } from 'express'
import { inject, injectable } from 'inversify'
import { MailBoxService } from '~/services/mail-box.service'
import { CreatedResponse, OKResponse } from '~/utils/success-response.util'

const MESSAGES = {
  COMPOSE_SUCCESS: 'Compose email successfully',
  SEND_SUCCESS: 'Send email successfully',
  REPLY_SUCCESS: 'Reply email successfully',
  FORWARD_SUCCESS: 'Forward email successfully'
}

@injectable()
export class MailBoxController {
  constructor(@inject(MailBoxService) private mailBoxService: MailBoxService) {}

  async darftMessage(req: Request, res: Response) {
    const data = await this.mailBoxService.darfMessage(req.mail_address, req.body)
    return new CreatedResponse(data, MESSAGES.COMPOSE_SUCCESS).send(req, res)
  }

  async sendMessage(req: Request, res: Response) {
    const data = await this.mailBoxService.sendMessage(req.mail_address, req.body)
    return new OKResponse(data, MESSAGES.SEND_SUCCESS).send(req, res)
  }

  async replyMessage(req: Request, res: Response) {
    const data = await this.mailBoxService.replyMessage(req.mail_address, req.body)
    return new OKResponse(data, MESSAGES.REPLY_SUCCESS).send(req, res)
  }

  async forwardMessage(req: Request, res: Response) {
    const data = await this.mailBoxService.fowardMessage(req.mail_address, req.body)
    return new OKResponse(data, MESSAGES.FORWARD_SUCCESS).send(req, res)
  }

  async discardMessage(req: Request, res: Response) {
    const data = await this.mailBoxService.discardMessage(
      req.mail_address,
      req.params.conversation_id,
      req.params.message_id
    )
    return new OKResponse(data).send(req, res)
  }

  async toggleAutoReply(req: Request, res: Response) {
    const data = await this.mailBoxService.toggleAutoReply(req.mail_address, req.body)
    return new OKResponse(data).send(req, res)
  }
}
