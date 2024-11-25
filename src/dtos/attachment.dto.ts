import { IsNotEmpty, IsString } from 'class-validator'

export class DeleteAttachment {
  @IsString()
  @IsNotEmpty()
  url_id: string
}
