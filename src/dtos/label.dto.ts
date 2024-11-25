import { IsNotEmpty, IsOptional, IsString } from 'class-validator'

export class CreateLabel {
  @IsString()
  @IsNotEmpty()
  name: string

  @IsString()
  @IsNotEmpty()
  @IsOptional()
  color?: string

  @IsString()
  @IsNotEmpty()
  description: string
}
export class UpdateLabel {
  @IsString()
  @IsNotEmpty()
  @IsOptional()
  name: string

  @IsString()
  @IsNotEmpty()
  @IsOptional()
  color?: string

  @IsString()
  @IsNotEmpty()
  @IsOptional()
  description: string
}
