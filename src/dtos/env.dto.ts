import { IsNotEmpty, IsString } from 'class-validator'
import { DtoBase } from './base.dto'

export class DtoEnv extends DtoBase {
  @IsString()
  @IsNotEmpty()
  DB_NAME!: string

  @IsString()
  @IsNotEmpty()
  DB_URI!: string

  @IsString()
  @IsNotEmpty()
  PORT!: number

  @IsString()
  @IsNotEmpty()
  BUILD_MODE!: string

  @IsString()
  @IsNotEmpty()
  SMTP_HOST!: string

  @IsString()
  @IsNotEmpty()
  SMTP_PORT!: number

  @IsString()
  @IsNotEmpty()
  SMTP_SERVICE!: string

  @IsString()
  @IsNotEmpty()
  SMTP_MAIL!: string

  @IsString()
  @IsNotEmpty()
  SMTP_PASSWORD: string

  @IsString()
  @IsNotEmpty()
  CLIENT_URL!: string

  @IsString()
  @IsNotEmpty()
  AT_JWT_SECRET!: string

  @IsString()
  @IsNotEmpty()
  AT_JWT_EXPIRES_IN!: string

  @IsString()
  @IsNotEmpty()
  RT_JWT_SECRET!: string

  @IsString()
  @IsNotEmpty()
  RT_JWT_EXPIRES_IN!: string

  @IsString()
  @IsNotEmpty()
  COOKIE_SECRET: string

  @IsString()
  @IsNotEmpty()
  CLOUDINARY_CLOUD_NAME: string

  @IsString()
  @IsNotEmpty()
  CLOUDINARY_API_KEY: string

  @IsString()
  @IsNotEmpty()
  CLOUDINARY_API_SECRET: string

  @IsString()
  @IsNotEmpty()
  CLOUDINARY_FOLDER: string

  @IsString()
  @IsNotEmpty()
  REDIS_URI: string
}
