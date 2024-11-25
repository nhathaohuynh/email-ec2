import { injectable } from 'inversify'
import { BaseRepository } from './repository.abstract'
import { EmailBoxModel, IEmailBox } from '~/databases/models/mail-box.model'

@injectable()
export class MailBoxRepository extends BaseRepository<IEmailBox> {
  constructor() {
    super(EmailBoxModel)
  }

  async findByUser(user: string) {
    return this.findOne({ user })
  }
}
