/* eslint-disable @typescript-eslint/no-unused-vars */
import bcrypt from 'bcryptjs'
import { inject, injectable } from 'inversify'
import env from '~/config/env.config'
import { USER_SELECT_FIELDS } from '~/databases/models/user.model'
import {
  RecoveryPassword,
  UpdateInformation,
  UpdatePassword,
  UserLogin,
  UserRegistration,
  VerificationToken
} from '~/dtos/user.dto'
import { UserRepository } from '~/repositories/user.repository'
import {
  EMAIL_TEMPLATE_RECOVERY_PASSWORD,
  EMAIL_TEMPLATE_TWO_STEP_VERIFICATION,
  NAME_SERVICE_INJECTION
} from '~/utils/constant.util'
import { BadRequest, ConflictError, ForbiddenError, NotFoundError } from '~/utils/error-response.util'
import {
  generateRecoveryPassword,
  generateToken,
  generateVerificationToken,
  replacePlaceholder,
  selectedFields,
  verifyToken
} from '~/utils'
import { EmailOptions } from '~/types'
import redisService from './redis.service'
import emailService from './email.service'
import { MailBoxService } from './mail-box.service'

const CONSTANT = {
  MSG_USER_EXIST: 'User already exists',
  MSG_CREATE_USER_FAILED: 'Failed to sign up a user',
  MSG_USER_NOT_FOUND: 'user not found',
  MSG_UPDATE_USER_FAILED: 'Failed to update user',
  MSG_DELETE_USER_FAILED: 'Failed to delete user',
  EMAIL_SUBJECT: 'Two step verification',
  MSG_INVALID_TOKEN: 'Invalid token',
  MSG_EXPIRED_TOKEN: 'Token is expired',
  MSG_NOT_ACCEPTABLE: 'User already verified',
  MSG_USER_LOGIN_FAILED: 'Email or password is incorrect',
  MSG_PASSWORD_NOT_MATCH: 'Password is not match',
  MSG_PASSWORD_SAME: 'New password must be different from old password'
}

@injectable()
export class UserService {
  constructor(
    @inject(MailBoxService) private readonly mailBoxService: MailBoxService,
    @inject(NAME_SERVICE_INJECTION.USER_REPOSITORY) private readonly userRepository: UserRepository
  ) {}

  async signUp({ email, mail_address, full_name, phone, password }: UserRegistration) {
    const existingUsser = await this.userRepository.findByPhone(phone)

    if (existingUsser) {
      throw new ConflictError(CONSTANT.MSG_USER_EXIST)
    }

    const hashPassword = bcrypt.hashSync(password)
    const user = await this.userRepository.create({
      email,
      full_name,
      phone,
      password: hashPassword
    })
    const mailBox = await this.mailBoxService.create(mail_address, user._id)

    const accessToken = generateToken(
      { id: user._id, mail_address: mailBox.mail_address },
      env.AT_JWT_SECRET,
      env.AT_EXPIRES_IN
    )
    const refreshToken = generateToken(
      { id: user._id, mail_address: mailBox.mail_address },
      env.RT_JWT_SECRET,
      env.RT_EXPIRES_IN
    )
    const userRes = selectedFields(USER_SELECT_FIELDS, user)

    return {
      ...userRes,
      mailBoxId: mailBox._id,
      mailAddress: mailBox.mail_address,
      accessToken: accessToken,
      refreshToken: refreshToken
    }
  }

  async signIn(body: UserLogin) {
    const user = await this.userRepository.findByPhoneAndGetPassword(body.phone)
    if (!user) {
      throw new NotFoundError(CONSTANT.MSG_USER_NOT_FOUND)
    }
    const isMatchPassword = bcrypt.compareSync(body.password, user.password)
    if (!isMatchPassword) {
      throw new BadRequest(CONSTANT.MSG_USER_LOGIN_FAILED)
    }

    if (user.two_step_verification) {
      const token = generateVerificationToken()
      await redisService.setTokenToRedis(user._id.toString(), token)
      const mailOptions: EmailOptions = {
        email: user.email,
        subject: CONSTANT.EMAIL_SUBJECT,
        html: replacePlaceholder(EMAIL_TEMPLATE_TWO_STEP_VERIFICATION, {
          verification_code: token
        })
      }

      emailService.sendSingleMail(mailOptions)
    }

    const mailBox = await this.mailBoxService.findByUser(user._id.toString())

    if (!mailBox) {
      throw new NotFoundError(CONSTANT.MSG_USER_NOT_FOUND)
    }

    const accessToken = generateToken(
      { id: user._id, mail_address: mailBox.mail_address },
      env.AT_JWT_SECRET,
      env.AT_EXPIRES_IN
    )
    const refreshToken = generateToken(
      { id: user._id, mail_address: mailBox.mail_address },
      env.RT_JWT_SECRET,
      env.RT_EXPIRES_IN
    )

    const userRes = selectedFields(USER_SELECT_FIELDS, user)
    return {
      ...userRes,
      mailBoxId: mailBox._id,
      mailAddress: mailBox.mail_address,
      accessToken,
      refreshToken
    }
  }

  async twoStepVerification(payload: VerificationToken, userId: string) {
    const user = await this.userRepository.findById(userId)

    if (!user) {
      throw new NotFoundError(CONSTANT.MSG_USER_NOT_FOUND)
    }
    const token = await redisService.getTokenFromRedis(user._id.toString())

    if (!token) {
      throw new BadRequest(CONSTANT.MSG_EXPIRED_TOKEN)
    }
    const isMatchToken = token === payload.token.trim()
    if (!isMatchToken) {
      throw new BadRequest(CONSTANT.MSG_INVALID_TOKEN)
    }

    return {
      _id: user._id
    }
  }

  async refreshToken(oldRefreshToken: string) {
    try {
      const user = verifyToken(oldRefreshToken, env.RT_JWT_SECRET)
      if (!user) {
        throw new ForbiddenError()
      }

      const accessToken = generateToken({ id: user.id }, env.AT_JWT_SECRET, env.AT_EXPIRES_IN)
      const refreshToken = generateToken({ id: user.id }, env.RT_JWT_SECRET, env.RT_EXPIRES_IN)

      return {
        user,
        accessToken,
        refreshToken
      }
    } catch (error) {
      throw new ForbiddenError()
    }
  }

  async updateInformation(userId: string, body: UpdateInformation) {
    const user = await this.userRepository.findById(userId)
    if (!user) {
      throw new NotFoundError(CONSTANT.MSG_USER_NOT_FOUND)
    }

    const res = await this.userRepository.findByIdAndUpdate(userId, {
      $set: {
        ...body,
        updatedAt: Date.now()
      }
    })

    if (!res) {
      throw new BadRequest(CONSTANT.MSG_UPDATE_USER_FAILED)
    }
    const userRes = selectedFields(USER_SELECT_FIELDS, res)

    return userRes
  }

  async changePassword(userId: string, body: UpdatePassword) {
    if (body.newPassword !== body.confirmPassword) {
      throw new BadRequest(CONSTANT.MSG_PASSWORD_NOT_MATCH)
    }

    const user = await this.userRepository.findByIdAndGetPassword(userId)
    if (!user) {
      throw new NotFoundError(CONSTANT.MSG_USER_NOT_FOUND)
    }
    if (body.password === body.newPassword) {
      throw new BadRequest(CONSTANT.MSG_PASSWORD_SAME)
    }

    const isMatchPassword = bcrypt.compareSync(body.password, user.password)
    if (!isMatchPassword) {
      throw new BadRequest(CONSTANT.MSG_PASSWORD_NOT_MATCH)
    }

    const hashPassword = bcrypt.hashSync(body.newPassword)
    const res = await this.userRepository.findByIdAndUpdate(userId, { $set: { password: hashPassword } })

    if (!res) {
      throw new BadRequest(CONSTANT.MSG_UPDATE_USER_FAILED)
    }

    return {
      _id: res._id
    }
  }

  async recoveryPassword(body: RecoveryPassword) {
    const user = await this.userRepository.findByPhoneAndGetPassword(body.phone)
    if (!user) {
      throw new NotFoundError(CONSTANT.MSG_USER_NOT_FOUND)
    }

    const recoveryPassword = generateRecoveryPassword()
    const hashPassword = bcrypt.hashSync(recoveryPassword)
    user.password = hashPassword

    const mailOptions: EmailOptions = {
      email: user.email,
      subject: 'Recovery password',
      html: replacePlaceholder(EMAIL_TEMPLATE_RECOVERY_PASSWORD, {
        new_password: recoveryPassword
      })
    }

    emailService.sendSingleMail(mailOptions)
    await user.save()

    return {
      _id: user._id
    }
  }
}
