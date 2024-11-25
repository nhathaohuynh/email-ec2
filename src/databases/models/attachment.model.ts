import mongoose, { Document, Schema } from 'mongoose'
import { DOCUMENT_MODLE_REGISTRATION } from '~/utils/constant.util'

export const ATTACHMENT_COLLECTION = 'attachments'

export interface IAttachment extends Document {
  _id: Schema.Types.ObjectId
  mail_address: string
  mime_type: string
  size: number
  url: string
  url_id: string
  name: string
  slug: string
}

const attachmentchema = new Schema<IAttachment>(
  {
    mime_type: {
      type: String,
      required: true,
      trim: true
    },
    size: {
      type: Number,
      required: true
    },
    mail_address: {
      type: String,
      unique: true,
      required: true
    },
    url: {
      type: String,
      required: true,
      trim: true
    },
    url_id: {
      type: String,
      required: true,
      trim: true
    },
    name: {
      type: String,
      required: true,
      trim: true
    },
    slug: {
      type: String,
      required: true,
      trim: true
    }
  },
  { timestamps: true, collection: ATTACHMENT_COLLECTION }
)

attachmentchema.index({ mimeType: 1, slug: 1, mail_address: 1 })

export const AttachmentModel = mongoose.model<IAttachment>(DOCUMENT_MODLE_REGISTRATION.ATTACHMENT, attachmentchema)
