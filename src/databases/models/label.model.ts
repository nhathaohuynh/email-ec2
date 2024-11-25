import mongoose, { Document, Schema } from 'mongoose'
import { DOCUMENT_MODLE_REGISTRATION } from '~/utils/constant.util'

export const LABEL_COLLECTION = 'labels'

export interface ILabel extends Document {
  _id: Schema.Types.ObjectId
  mail_address: string
  name: string
  color?: string
  description: string
}

export const labelSchema = new Schema<ILabel>(
  {
    name: {
      type: String,
      required: true,
      trim: true
    },

    mail_address: {
      type: String,
      required: true,
      trim: true
    },

    color: {
      type: String,
      trim: true,
      default: null
    },

    description: {
      type: String,
      trim: true
    }
  },
  { timestamps: true, collection: LABEL_COLLECTION }
)
labelSchema.index({ name: 1, mail_address: 1 }, { unique: true })

export const LabelModel = mongoose.model<ILabel>(DOCUMENT_MODLE_REGISTRATION.LABEL, labelSchema)
