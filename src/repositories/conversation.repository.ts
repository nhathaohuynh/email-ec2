import { injectable } from 'inversify'
import { BaseRepository } from './repository.abstract'
import { ConversationModel, IConversation } from '~/databases/models/conversation.model'
import { FilterQuery } from 'mongoose'
import { DOCUMENT_MODLE_REGISTRATION } from '~/utils/constant.util'

@injectable()
export class ConversationRepository extends BaseRepository<IConversation> {
  constructor() {
    super(ConversationModel)
  }

  find(query: FilterQuery<IConversation>) {
    return this.model
      .find(query)
      .populate({
        path: 'messages',
        model: DOCUMENT_MODLE_REGISTRATION.MESSAGE,
        populate: {
          path: 'attachments',
          model: DOCUMENT_MODLE_REGISTRATION.ATTACHMENT
        }
      })
      .populate('labels')
      .sort({ createdAt: 'asc' })
      .exec()
  }
}
