export type Constructor<T> = new () => T

export type IRoute = {
  path: string
  method?: string
  child?: Record<string, IRoute>
}

export type EmailOptions = {
  email: string
  subject: string
  html: string
}

export type Pagination = {
  page?: number
  itemPerPage?: number
}

export type JWTPayload = {
  id: string
  mail_address: string
}

export enum MessageStatus {
  DRAFT = 'draft',
  SENT = 'sent'
}
