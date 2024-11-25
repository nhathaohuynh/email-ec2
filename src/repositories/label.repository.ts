import { injectable } from 'inversify'
import { BaseRepository } from './repository.abstract'
import { ILabel, LabelModel } from '~/databases/models/label.model'
import { FilterQuery } from 'mongoose'

@injectable()
export class LabelRepository extends BaseRepository<ILabel> {
  constructor() {
    super(LabelModel)
  }

  async find(query: FilterQuery<ILabel>) {
    // how sort follow aplabet
    return this.model
      .find(query)
      .sort({
        name: 'asc'
      })
      .lean()
      .exec()
  }
}
