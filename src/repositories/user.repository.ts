import { injectable } from 'inversify'
import { IUser, UserModel } from '~/databases/models/user.model'
import { BaseRepository } from './repository.abstract'

@injectable()
export class UserRepository extends BaseRepository<IUser> {
  constructor() {
    super(UserModel)
  }

  findByEmail(email: string) {
    return this.findOne({ email })
  }

  findByPhone(phone: string) {
    return this.findOne({ phone })
  }

  findByPhoneAndGetPassword(phone: string) {
    return this.findOne({ phone }, '+password')
  }

  findByIdAndGetPassword(id: string) {
    return this.model.findById(id).select('+password')
  }

  createByModel(data: Partial<IUser>) {
    return new UserModel(data)
  }
}
