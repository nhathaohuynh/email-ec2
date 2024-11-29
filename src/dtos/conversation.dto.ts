import { IsBoolean, IsNotEmpty, IsOptional, IsString } from 'class-validator'

export class SearchConversation {
  @IsString()
  @IsNotEmpty()
  @IsOptional()
  subject?: string

  @IsBoolean()
  @IsNotEmpty()
  @IsOptional()
  has_attachments?: boolean

  @IsString()
  @IsNotEmpty()
  @IsOptional()
  to?: string

  @IsString()
  @IsNotEmpty()
  @IsOptional()
  fromDate?: Date

  @IsNotEmpty()
  @IsOptional()
  toDate?: Date
}

export class LabelConversation {
  @IsString()
  @IsNotEmpty()
  label_id: string
}
