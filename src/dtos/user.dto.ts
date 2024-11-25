import { IsBoolean, IsEmail, IsNotEmpty, IsOptional, IsString, Matches, MaxLength, MinLength } from 'class-validator'
import { MAIL_ADDRESS_RULE, PHONE_RULE } from '~/utils/constant.util'

export class UserRegistration {
  @IsString()
  @IsNotEmpty()
  @MinLength(3)
  @MaxLength(256)
  full_name: string

  @IsString()
  @IsNotEmpty()
  @IsEmail()
  email: string

  @IsString()
  @IsNotEmpty()
  @Matches(MAIL_ADDRESS_RULE, { message: 'mail_address must end with @mvmanh.com' })
  mail_address: string

  @IsString()
  @IsNotEmpty()
  @Matches(PHONE_RULE, { message: 'phone must be 10 digits' })
  phone: string

  @IsString()
  @IsNotEmpty()
  @MaxLength(20)
  @MinLength(8)
  password: string
}

export class UserLogin {
  @IsString()
  @IsNotEmpty()
  phone: string

  @IsString()
  @IsNotEmpty()
  @MaxLength(20)
  @MinLength(8)
  password: string
}

export class VerificationToken {
  @IsString()
  @IsNotEmpty()
  token: string
}

export class UpdateInformation {
  @IsString()
  @IsOptional()
  @IsNotEmpty()
  @MinLength(3)
  @MaxLength(50)
  full_name: string

  @IsString()
  @IsOptional()
  @IsNotEmpty()
  avatar: string

  @IsString()
  @IsEmail()
  @IsOptional()
  @IsNotEmpty()
  email: string

  @IsBoolean()
  @IsOptional()
  @IsNotEmpty()
  two_step_verification: string
}

export class UpdatePassword {
  @IsString()
  @IsNotEmpty()
  @MinLength(8)
  password: string

  @IsString()
  @IsNotEmpty()
  @MinLength(8)
  newPassword: string

  @IsString()
  @IsNotEmpty()
  @MinLength(8)
  confirmPassword: string
}

export class RecoveryPassword {
  @IsString()
  @IsNotEmpty()
  @Matches(PHONE_RULE, { message: 'phone must be 10 digits' })
  phone: string
}
