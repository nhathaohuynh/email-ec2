import mongoose, { Document, ObjectId, Schema } from 'mongoose'
import { DEFAULT_AVATAR, DOCUMENT_MODLE_REGISTRATION, PHONE_RULE } from '~/utils/constant.util'

export const USER_COLLECTION = 'users'

export const USER_NOT_EXPOSE_FIELDS = ['password', 'verifyToken', 'expired']

export interface IUser extends Document {
  _id: ObjectId
  email: string
  password: string
  full_name: string
  avatar: string
  phone: string
  two_step_verification: boolean
  createdAt: Date
  updatedAt: Date
}

export const USER_SELECT_FIELDS = ['_id', 'full_name', 'email', 'avatar', 'phone', 'two_step_verification']

const UserSchema: Schema = new Schema<IUser>(
  {
    email: {
      type: String,
      required: true,
      trim: true,
      unique: true,
      index: true,
      validate: {
        validator: function (email: string) {
          return /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/.test(email)
        },
        message: 'Invalid email address'
      }
    },

    password: {
      type: String,
      required: true,
      minlength: 8,
      trim: true,
      select: false
    },

    full_name: {
      type: String,
      required: true,
      trim: true
    },

    avatar: {
      type: String,
      trim: true,
      default: DEFAULT_AVATAR
    },

    phone: {
      type: String,
      trim: true,
      required: true,
      match: PHONE_RULE
    },

    two_step_verification: {
      type: Boolean,
      default: false
    }
  },
  {
    timestamps: true,
    collection: USER_COLLECTION
  }
)

UserSchema.index({ email: 1, phone: 1 })

export const UserModel = mongoose.model<IUser>(DOCUMENT_MODLE_REGISTRATION.USER, UserSchema)
