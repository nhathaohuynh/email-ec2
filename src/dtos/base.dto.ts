import { Expose, Transform } from 'class-transformer'
import { IsOptional } from 'class-validator'

export class DtoBase {}

export class DtoExposeBase {
  @Expose()
  @IsOptional()
  @Transform((params) => params.obj._id)
  _id: string

  @Expose()
  @IsOptional()
  createdAt: Date

  @Expose()
  @IsOptional()
  updatedAt: Date
}
