import { injectable } from 'inversify'
import { BaseRepository } from './repository.abstract'
import { AttachmentModel, IAttachment } from '~/databases/models/attachment.model'

@injectable()
export class AttachmentRepository extends BaseRepository<IAttachment> {
  constructor() {
    super(AttachmentModel)
  }
}
