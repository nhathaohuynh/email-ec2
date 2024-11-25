import { IsArray, IsNotEmpty, IsOptional, IsString } from 'class-validator'
import { ObjectId } from 'mongoose'

export class ComposeMessage {
  @IsString()
  @IsNotEmpty()
  @IsOptional()
  message_id: ObjectId

  @IsString()
  @IsNotEmpty()
  @IsOptional()
  reply_message: ObjectId

  @IsString()
  @IsNotEmpty()
  @IsOptional()
  conversation_id: ObjectId

  @IsString()
  @IsNotEmpty()
  @IsOptional()
  reply_normal: ObjectId

  @IsString()
  @IsNotEmpty()
  @IsOptional()
  forward_message: ObjectId

  @IsString()
  @IsNotEmpty()
  @IsOptional()
  reply_bcc: ObjectId

  @IsString()
  @IsNotEmpty()
  @IsOptional()
  subject: string

  @IsString()
  @IsNotEmpty()
  @IsOptional()
  body: string

  @IsArray()
  @IsNotEmpty()
  @IsOptional()
  attachments: ObjectId[]

  @IsArray()
  @IsNotEmpty()
  @IsOptional()
  to: string[]

  @IsArray()
  @IsNotEmpty()
  @IsOptional()
  cc: string[]

  @IsArray()
  @IsNotEmpty()
  @IsOptional()
  bcc: string[]
}

export class SendMessage {
  @IsString()
  @IsNotEmpty()
  message_id: ObjectId

  @IsString()
  @IsNotEmpty()
  conversation_id: ObjectId

  @IsString()
  @IsNotEmpty()
  subject: string

  @IsString()
  @IsNotEmpty()
  body: string

  @IsArray()
  @IsNotEmpty()
  @IsOptional()
  attachments: ObjectId[]

  @IsArray()
  @IsNotEmpty()
  @IsOptional()
  to: string[]

  @IsArray()
  @IsNotEmpty()
  @IsOptional()
  cc: string[]

  @IsArray()
  @IsNotEmpty()
  @IsOptional()
  bcc: string[]
}

export class ReplyMessage {
  @IsString()
  @IsNotEmpty()
  message_id: ObjectId

  @IsString()
  @IsNotEmpty()
  conversation_id: ObjectId

  @IsString()
  @IsNotEmpty()
  body: string

  @IsArray()
  @IsNotEmpty()
  @IsOptional()
  attachments: ObjectId[]

  @IsString()
  @IsNotEmpty()
  reply_message: ObjectId
}

export class ForwardMessage {
  @IsString()
  @IsNotEmpty()
  message_id: ObjectId

  @IsString()
  @IsNotEmpty()
  conversation_id: ObjectId

  @IsArray()
  @IsNotEmpty()
  @IsOptional()
  attachments: ObjectId[]

  @IsArray()
  @IsNotEmpty()
  @IsOptional()
  to: string[]

  @IsArray()
  @IsNotEmpty()
  @IsOptional()
  cc: string[]

  @IsArray()
  @IsNotEmpty()
  @IsOptional()
  bcc: string[]

  @IsString()
  @IsNotEmpty()
  forward_message: ObjectId
}
