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

export enum ConversationStatus {
  INBOX = 'inbox',
  STARRED = 'starred',
  TRASH = 'trash',
  DRAFT = 'draft',
  SENT = 'sent'
}

export enum ActionConversation {
  MOVE_INBOX = 'inbox',
  STARRED = 'starred',
  MOVE_TRASH = 'trash',
  READ_STATUS = 'read'
}

export type SearchFields = {
  subject?: string
  has_attachments?: boolean
  to?: string
  fromDate?: Date
  toDate?: Date
}

export enum StatusActionLabel {
  INSERT = 'insert',
  REMOVE = 'remove'
}
