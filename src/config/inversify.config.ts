import { Container } from 'inversify'
import 'reflect-metadata'
import { IAttachment } from '~/databases/models/attachment.model'
import { IConversation } from '~/databases/models/conversation.model'
import { ILabel } from '~/databases/models/label.model'
import { IEmailBox } from '~/databases/models/mail-box.model'
import { IMessage } from '~/databases/models/message.model'
import { IUser } from '~/databases/models/user.model'
import { AttachmentController } from '~/http/controllers/attachment.controller'
import { ConversationController } from '~/http/controllers/conversation.controller'
import { LabelController } from '~/http/controllers/label.controller'
import { MailBoxController } from '~/http/controllers/mail-box.controller'
import { UserController } from '~/http/controllers/user.controller'
import { AttachmentRepository } from '~/repositories/attachment.repository'
import { ConversationRepository } from '~/repositories/conversation.repository'
import { LabelRepository } from '~/repositories/label.repository'
import { MailBoxRepository } from '~/repositories/mail-box'
import { MessageRepository } from '~/repositories/message.repository'
import { UserRepository } from '~/repositories/user.repository'
import { AttachmentService } from '~/services/attachment.service'
import { ConversationService } from '~/services/conversation.service'
import { LabelService } from '~/services/label.service'
import { MailBoxService } from '~/services/mail-box.service'
import { MessageService } from '~/services/message.service'
import { UserService } from '~/services/user.service'
import { IRepository } from '~/types/interfaces'
import { NAME_SERVICE_INJECTION } from '~/utils/constant.util'

const container = new Container()

container.bind<IRepository<IUser>>(NAME_SERVICE_INJECTION.USER_REPOSITORY).to(UserRepository)
container.bind(UserService).to(UserService)
container.bind(UserController).to(UserController)

// message
container.bind<IRepository<IMessage>>(NAME_SERVICE_INJECTION.MESSAGE_REPOSITORY).to(MessageRepository)
container.bind(MessageService).to(MessageService)

container.bind<IRepository<IConversation>>(NAME_SERVICE_INJECTION.CONVERSATION_REPOSITORY).to(ConversationRepository)
container.bind(ConversationService).to(ConversationService)
container.bind(ConversationController).to(ConversationController)

container.bind<IRepository<IEmailBox>>(NAME_SERVICE_INJECTION.MAIL_BOX_REPOSITORY).to(MailBoxRepository)
container.bind(MailBoxService).to(MailBoxService)
container.bind(MailBoxController).to(MailBoxController)

// attachment
container.bind<IRepository<IAttachment>>(NAME_SERVICE_INJECTION.ATTACHMENT_REPOSITORY).to(AttachmentRepository)
container.bind(AttachmentService).to(AttachmentService)
container.bind(AttachmentController).to(AttachmentController)

// label
container.bind<IRepository<ILabel>>(NAME_SERVICE_INJECTION.LABEL_REPOSIROTY).to(LabelRepository)
container.bind(LabelService).to(LabelService)
container.bind(LabelController).to(LabelController)

export { container }
