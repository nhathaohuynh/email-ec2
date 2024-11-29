import { Request, Response } from 'express'
import { inject, injectable } from 'inversify'
import { IConversation } from '~/databases/models/conversation.model'
import { ConversationService } from '~/services/conversation.service'
import { ActionConversation, ConversationStatus, StatusActionLabel } from '~/types'
import { OKResponse } from '~/utils/success-response.util'

// const MESSAGES = {}

@injectable()
export class ConversationController {
  constructor(@inject(ConversationService) private service: ConversationService) {}

  async getList(req: Request, res: Response) {
    const status = req.query.status as ConversationStatus
    const data = await this.service.getListConversation(req.mail_address, status)
    return new OKResponse(data).send(req, res)
  }

  async searchConversation(req: Request, res: Response) {
    const data = await this.service.searchConversation(req.mail_address, req.body)
    return new OKResponse(data).send(req, res)
  }

  async getListByLabel(req: Request, res: Response) {
    const data = await this.service.getconversationByLabel(req.mail_address, req.params.label_id)
    return new OKResponse(data).send(req, res)
  }

  async labelConversation(req: Request, res: Response) {
    const statusActionLabel = req.query.action as StatusActionLabel

    if (statusActionLabel === StatusActionLabel.INSERT) {
      await this.service.addLabel(req.params.id as string, req.body)

      return new OKResponse({
        _id: req.params.id as string
      }).send(req, res)
    }

    await this.service.removeLabel(req.params.id, req.body)
    return new OKResponse({
      _id: req.params.id as string
    }).send(req, res)
  }

  async updateStatus(req: Request, res: Response) {
    const status = req.query.status as ActionConversation

    // Define a mapping of status to service methods
    const statusHandlers: Record<ActionConversation, () => Promise<IConversation | null>> = {
      [ActionConversation.MOVE_INBOX]: () => this.service.moveToInbox(req.params.id),
      [ActionConversation.STARRED]: () => this.service.toggleStarredStatus(req.params.id),
      [ActionConversation.MOVE_TRASH]: () => this.service.moveToTrash(req.params.id),
      [ActionConversation.READ_STATUS]: () => this.service.toggleReadStatus(req.params.id)
    }

    // Check if the status is valid and execute the corresponding method
    const handler = statusHandlers[status]
    if (handler) {
      await handler()
      return new OKResponse({
        _id: req.params.id
      }).send(req, res)
    }

    // Handle invalid status values
    return new OKResponse({}).send(req, res)
  }
}
