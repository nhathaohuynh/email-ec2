import { injectable, unmanaged } from 'inversify'
import { Document, FilterQuery, Model, UpdateQuery } from 'mongoose'
import { IRepository } from '~/types/interfaces'

@injectable()
export abstract class BaseRepository<T extends Document> implements IRepository<T> {
  constructor(@unmanaged() protected readonly model: Model<T>) {}

  findOne(query: FilterQuery<T>, select?: string): Promise<T | null> {
    if (select) {
      return this.model.findOne(query).select(select).exec()
    }
    return this.model.findOne(query).exec()
  }

  findById(id: string): Promise<T | null> {
    return this.model.findById(id).exec()
  }

  create(data: Partial<T>): Promise<T> {
    return this.model.create(data)
  }

  findByIdAndUpdate(id: string, data: UpdateQuery<T>, options?: object): Promise<T | null> {
    return this.model.findByIdAndUpdate(id, data, { new: true, ...options }).exec()
  }

  findByIdAndDelete(id: string): Promise<T | null> {
    return this.model.findByIdAndDelete(id).exec()
  }
}
