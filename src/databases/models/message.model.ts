import mongoose, { Document, Schema } from 'mongoose'
import { DOCUMENT_MODLE_REGISTRATION, MAIL_ADDRESS_RULE } from '~/utils/constant.util'

export const MESSAGE_COLLECTION = 'messages'

export interface IMessage extends Document {
  _id: Schema.Types.ObjectId
  subject: string
  body: string
  sent_date: Date
  draft_date: Date
  draft_status: boolean
  attachments: Schema.Types.ObjectId[]
  from: string
  to: string[]
  cc: string[]
  bcc: string[]
  auto_reply_status: boolean
  forward_message: Schema.Types.ObjectId | null
  reply_message: Schema.Types.ObjectId | null
  orginal_message: Schema.Types.ObjectId | null
}

const messageSchema = new Schema<IMessage>(
  {
    body: {
      type: String,
      trim: true,
      default: null
    },

    subject: {
      type: String,
      trim: true,
      default: null
    },

    attachments: {
      type: [{ type: Schema.Types.ObjectId, ref: DOCUMENT_MODLE_REGISTRATION.ATTACHMENT }],
      default: []
    },

    from: {
      type: String,
      required: true,
      validate: {
        validator: function (email: string) {
          return MAIL_ADDRESS_RULE.test(email)
        },
        message: 'Invalid username address'
      }
    },

    to: {
      type: [
        {
          type: String,
          validate: {
            validator: function (email: string) {
              return MAIL_ADDRESS_RULE.test(email)
            },
            message: 'Invalid username address'
          }
        }
      ],
      default: []
    },

    cc: {
      type: [
        {
          type: String,
          validate: {
            validator: function (email: string) {
              return MAIL_ADDRESS_RULE.test(email)
            },
            message: 'Invalid username address'
          }
        }
      ],
      default: []
    },

    bcc: {
      type: [
        {
          type: String,
          validate: {
            validator: function (email: string) {
              return MAIL_ADDRESS_RULE.test(email)
            },
            message: 'Invalid username address'
          }
        }
      ],
      default: []
    },
    orginal_message: {
      type: Schema.Types.ObjectId,
      default: null
    },

    reply_message: {
      type: Schema.Types.ObjectId,
      default: null
    },

    auto_reply_status: {
      type: Boolean,
      default: false
    },

    forward_message: {
      type: Schema.Types.ObjectId,
      default: null
    },

    sent_date: {
      type: Date,
      default: null
    },

    draft_status: {
      type: Boolean,
      default: true
    }
  },
  {
    timestamps: true,
    collection: MESSAGE_COLLECTION
  }
)

messageSchema.index({ from: 1 })

export const MessageModel = mongoose.model<IMessage>(DOCUMENT_MODLE_REGISTRATION.MESSAGE, messageSchema)
