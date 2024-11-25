import { injectable } from 'inversify'
import { BaseRepository } from './repository.abstract'
import { IMessage, MessageModel } from '~/databases/models/message.model'

@injectable()
export class MessageRepository extends BaseRepository<IMessage> {
  constructor() {
    super(MessageModel)
  }
}
