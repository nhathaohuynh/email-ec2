import { FilterQuery, UpdateQuery } from 'mongoose'

export interface IRepository<T> {
  findOne: (query: FilterQuery<T>, select?: string) => Promise<T | null>
  findById: (id: string) => Promise<T | null>
  create: (data: Partial<T>) => Promise<T | null>
  findByIdAndUpdate: (id: string, data: UpdateQuery<T>, options: object) => Promise<Partial<T> | null>
  findByIdAndDelete: (id: string) => Promise<Partial<T> | null>
}
