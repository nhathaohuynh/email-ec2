import mongoose, { Document, Schema } from 'mongoose'
import { DOCUMENT_MODLE_REGISTRATION } from '~/utils/constant.util'

export const CONVERSATION_COLLECTION = 'conversations'

export interface IConversation extends Document {
  _id: Schema.Types.ObjectId
  mail_address: string
  subject: string
  slug: string
  has_attachments: boolean
  last_message_date: Date
  participant_mail: string[]
  inbox_status: boolean
  draft_status: boolean
  sent_status: boolean
  starred_status: boolean
  trash_status: boolean
  labels: Schema.Types.ObjectId[]
  read_status: boolean
  messages: Schema.Types.ObjectId[]
}

export const conversationSchema = new Schema<IConversation>(
  {
    subject: {
      type: String,
      required: true,
      trim: true
    },

    has_attachments: {
      type: Boolean,
      default: false
    },

    last_message_date: {
      type: Date,
      default: Date.now()
    },

    slug: {
      type: String,
      required: true,
      trim: true
    },

    mail_address: {
      type: String,
      required: true
    },
    inbox_status: {
      type: Boolean,
      default: false
    },

    participant_mail: {
      type: [
        {
          type: String
        }
      ],
      default: []
    },

    sent_status: {
      type: Boolean,
      default: false
    },

    starred_status: {
      type: Boolean,
      default: false
    },

    draft_status: {
      type: Boolean,
      default: false
    },

    trash_status: {
      type: Boolean,
      default: false
    },

    labels: {
      type: [
        {
          type: Schema.Types.ObjectId,
          ref: DOCUMENT_MODLE_REGISTRATION.LABEL
        }
      ],
      default: []
    },

    read_status: {
      type: Boolean,
      default: false
    },

    messages: {
      type: [{ type: Schema.Types.ObjectId, ref: DOCUMENT_MODLE_REGISTRATION.MESSAGE }],
      required: true
    }
  },
  { timestamps: true, collection: CONVERSATION_COLLECTION }
)

conversationSchema.index({ participant_mail: 1, inbox_status: 1 })
conversationSchema.index({ participant_mail: 1, starred_status: 1 })
conversationSchema.index({ participant_mail: 1, sent_status: 1 })
conversationSchema.index({ participant_mail: 1, draft_status: 1 })
conversationSchema.index({ participant_mail: 1, trash_status: 1 })
conversationSchema.index({ labels: 1 })
conversationSchema.index({ createdAt: -1 })
conversationSchema.index({ slug: 'text', mail_address: 'text' })

export const ConversationModel = mongoose.model<IConversation>(
  DOCUMENT_MODLE_REGISTRATION.CONVERSATION,
  conversationSchema
)
