import { injectable } from 'inversify'
import { BaseRepository } from './repository.abstract'
import { ConversationModel, IConversation } from '~/databases/models/conversation.model'
import { FilterQuery } from 'mongoose'

@injectable()
export class ConversationRepository extends BaseRepository<IConversation> {
  constructor() {
    super(ConversationModel)
  }

  find(query: FilterQuery<IConversation>) {
    return this.model.find(query).populate('message').populate('labels').sort({ createdAt: 'asc' }).exec()
  }
}
