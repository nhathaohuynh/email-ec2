import jwt from 'jsonwebtoken'
import { JWTPayload } from '~/types'

export const replacePlaceholder = (template: string, params: Record<string, string>) => {
  Object.keys(params).forEach((key) => {
    const placeholder = `{{${key}}}`
    template = template.replace(new RegExp(placeholder, 'g'), params[key])
  })
  return template
}

export const generateToken = (payload: object, secret: string, expiresIn: string) => {
  return jwt.sign(payload, secret, { expiresIn, algorithm: 'HS256' })
}

export const verifyToken = (token: string, secret: string) => {
  return jwt.verify(token, secret) as JWTPayload
}

export const slugify = (text: string) => {
  if (!text) return ''

  return String(text)
    .normalize('NFKD')
    .replace(/[\u0300-\u036f]/g, '')
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9 ]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
}

export const handlePageSkip = (page: number, limit: number) => {
  if (!page || !limit) return 0
  if (page <= 0 || limit <= 0) return 0
  return 1 * (page - 1) * limit
}

export const generateVerificationToken = () => Math.floor(100000 + Math.random() * 900000).toString()

export const selectedFields = <T extends object>(fields: string[], obj: T): Partial<T> => {
  return fields.reduce((acc, field) => {
    if (field in obj) {
      acc[field as keyof T] = obj[field as keyof T]
    }

    return acc
  }, {} as Partial<T>)
}

import { plainToClass } from 'class-transformer'
import { validateSync } from 'class-validator'
import dtoRegistry from '~/dtos/dto-registration'
import env from '~/config/env.config'

export const validation = <DTO>(nameStrategy: string, data: object) => {
  const classValidation = dtoRegistry.get(nameStrategy)

  if (!classValidation) {
    return false
  }

  const validatteObject = plainToClass(classValidation, data)
  const errors = validateSync(validatteObject)

  if (errors.length > 0) {
    const errorMessages = errors.map((error) => ({
      [error.property]: Object.values(error.constraints as object)
    }))

    if (env.BUILD_MODE === 'development') {
      console.log(errorMessages)
    }
    return false
  }
  return validatteObject as DTO
}

export function generateRecoveryPassword(): string {
  const length = 8
  let password = ''

  for (let i = 0; i < length; i++) {
    password += Math.floor(Math.random() * 10)
  }

  return password
}
