import mongoose, { Document, Schema } from 'mongoose'
import { DOCUMENT_MODLE_REGISTRATION, MAIL_ADDRESS_RULE } from '~/utils/constant.util'

export const EMAIL_BOX_COLLECTION = 'emaill_boxes'

export interface IEmailBox extends Document {
  _id: Schema.Types.ObjectId
  user: Schema.Types.ObjectId
  mail_address: string
  auto_reply_enabled: boolean
  auto_reply_message: string
  labels: [
    {
      label: Schema.Types.ObjectId
      conversations: Schema.Types.ObjectId[]
    }
  ]
  createdAt: Date
  updatedAt: Date
}

const mailAdressSchema = new Schema<IEmailBox>(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: DOCUMENT_MODLE_REGISTRATION.USER,
      required: true
    },

    mail_address: {
      unique: true,
      index: true,
      type: String,
      required: true,
      minlength: 3,
      maxlength: 256,
      trim: true,
      validate: {
        validator: function (email: string) {
          return MAIL_ADDRESS_RULE.test(email)
        },
        message: 'Invalid username address'
      }
    },

    auto_reply_enabled: {
      type: Boolean,
      default: false
    },

    auto_reply_message: {
      type: String,
      default: ''
    },

    labels: [
      {
        label: {
          type: Schema.Types.ObjectId,
          ref: DOCUMENT_MODLE_REGISTRATION.LABEL
        }
      }
    ]
  },
  { timestamps: true, collection: EMAIL_BOX_COLLECTION }
)

mailAdressSchema.index({ user: 1, mail_address: 1 }, { unique: true })

export const EmailBoxModel = mongoose.model<IEmailBox>(DOCUMENT_MODLE_REGISTRATION.MAIL_BOX, mailAdressSchema)
