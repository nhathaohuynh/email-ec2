import { nameStrateryValidation } from '~/http/routes/route-config-app'
import { Constructor } from '~/types'
import { DtoBase } from './base.dto'

import {
  RecoveryPassword,
  UpdateInformation,
  UpdatePassword,
  UserLogin,
  UserRegistration,
  VerificationToken
} from './user.dto'
import { DtoEnv } from './env.dto'
import { CreateLabel, UpdateLabel } from './label.dto'
import { DraftMessage, ForwardMessage, ReplyMessage, SendMessage } from './mail-box.dto'
import { LabelConversation, SearchConversation } from './conversation.dto'

const dtoRegistry: Map<string, Constructor<DtoBase>> = new Map()

// user dto
dtoRegistry.set(nameStrateryValidation.ENV_STRATEGY, DtoEnv)
dtoRegistry.set(nameStrateryValidation.SIGNUP, UserRegistration)
dtoRegistry.set(nameStrateryValidation.SIGNIN, UserLogin)
dtoRegistry.set(nameStrateryValidation.UPDATE_INFORMATION, UpdateInformation)
dtoRegistry.set(nameStrateryValidation.UPDATE_PASSWORD, UpdatePassword)
dtoRegistry.set(nameStrateryValidation.VERIFY_TOKEN, VerificationToken)
dtoRegistry.set(nameStrateryValidation.RECOVERY_PASSWORD, RecoveryPassword)

// mail box dto
dtoRegistry.set(nameStrateryValidation.COMPOSE_MAIL, DraftMessage)
dtoRegistry.set(nameStrateryValidation.SEND_MAIL, SendMessage)
dtoRegistry.set(nameStrateryValidation.REPLY_MAIL, ReplyMessage)
dtoRegistry.set(nameStrateryValidation.FORWARD_MAIL, ForwardMessage)

// attachment dto

// label dto
dtoRegistry.set(nameStrateryValidation.CREATE_LABEL, CreateLabel)
dtoRegistry.set(nameStrateryValidation.UPDATE_LABEL, UpdateLabel)

// conversation dto
dtoRegistry.set(nameStrateryValidation.SEARCH_CONVERSATION, SearchConversation)
dtoRegistry.set(nameStrateryValidation.LABEL_CONVERSATION, LabelConversation)

export default dtoRegistry
