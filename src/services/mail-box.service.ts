import { inject, injectable } from 'inversify'
import { DraftMessage, ForwardMessage, ReplyMessage, SendMessage } from '~/dtos/mail-box.dto'
import { MailBoxRepository } from '~/repositories/mail-box'
import { MAIL_ADDRESS_RULE, NAME_SERVICE_INJECTION } from '~/utils/constant.util'
import { MessageService } from './message.service'
import { BadRequest } from '~/utils/error-response.util'
import { IMessage } from '~/databases/models/message.model'
import { IConversation } from '~/databases/models/conversation.model'
import { slugify } from '~/utils'
import { ConversationService } from './conversation.service'

const MESSAGES = {
  MESSAGE_NOT_FOUND: 'Message not found',
  PROVIDE_RECIPIENT: 'Please provide at least one recipient',
  CONVERSATION_CREATE_FAILED: 'Failed to create conversation',
  CONVERSATION_NOT_FOUND: 'Conversation not found',
  INVALID_MAIL_ADDRESS: 'Invalid mail address'
}

@injectable()
export class MailBoxService {
  constructor(
    @inject(NAME_SERVICE_INJECTION.MAIL_BOX_REPOSITORY) private readonly repository: MailBoxRepository,
    @inject(MessageService) private readonly messageService: MessageService,
    @inject(ConversationService) private readonly conversation: ConversationService
  ) {}

  async darfMessage(mail_address: string, payload: DraftMessage) {
    // handle save relpy draft message
    if (payload.reply_message && payload.conversation_id) {
      if (!payload.message_id) {
        // the first time relpy draft message

        const conversation = await this.conversation.findById(payload.conversation_id.toString())
        if (!conversation) {
          throw new BadRequest(MESSAGES.CONVERSATION_NOT_FOUND)
        }
        const payloadMessage: Partial<IMessage> = {
          subject: 'Re: ' + conversation.subject,
          body: payload.body,
          reply_message: payload.reply_message,
          to: payload.to || [],
          cc: [],
          bcc: [],
          attachments: payload.attachments || [],
          draft_status: true,
          sent_date: new Date(Date.now()),
          from: mail_address
        }

        const message = await this.messageService.create(payloadMessage)

        conversation.has_attachments = conversation.has_attachments || message.attachments.length > 0
        conversation.last_message_date = message.draft_date
        conversation.draft_status = true
        conversation.read_status = true
        conversation.messages.push(message._id)

        await conversation.save()

        return { conversation: await conversation.populate('messages') }
      } else {
        const message = await this.messageService.updateMessageById(payload.message_id.toString(), {
          ...payload,
          draft_status: true,
          from: mail_address
        })

        if (!message) throw new BadRequest(MESSAGES.MESSAGE_NOT_FOUND)

        const conversation = await this.conversation.updateById(payload.conversation_id.toString(), {
          has_attachments: !!payload?.attachments?.length
        })

        if (!conversation) {
          throw new BadRequest(MESSAGES.CONVERSATION_NOT_FOUND)
        }
        return { conversation: await conversation.populate('messages') }
      }
    }

    // handle save forward draft message
    if (payload.forward_message && payload.conversation_id) {
      const validReceiver = [...(payload.to || []), ...(payload.cc || []), ...(payload.bcc || [])]

      if (validReceiver.length === 0) {
        throw new BadRequest(MESSAGES.PROVIDE_RECIPIENT)
      }

      if (!payload.message_id) {
        // the first time forward draft message
        const forwardMessage = await this.messageService.findById(payload.forward_message.toString())

        if (!forwardMessage) {
          throw new BadRequest(MESSAGES.MESSAGE_NOT_FOUND)
        }
        const orginalMessage = !forwardMessage.orginal_message
          ? forwardMessage
          : await this.messageService.findById(forwardMessage.orginal_message.toString())

        if (!orginalMessage) {
          throw new BadRequest(MESSAGES.MESSAGE_NOT_FOUND)
        }
        const payloadMessage: Partial<IMessage> = {
          subject: 'Fwd: ' + forwardMessage.subject,
          body:
            '---------- Forwarded message ----------' +
            '\n\n' +
            'From: ' +
            forwardMessage.from +
            '\n' +
            'Date: ' +
            forwardMessage.sent_date +
            'Subject: ' +
            forwardMessage.subject +
            '\n' +
            'To: ' +
            forwardMessage.to.join(', ') +
            '\n' +
            forwardMessage.body,

          to: payload?.to?.length > 0 ? payload.to : [],
          cc: payload?.cc?.length > 0 ? payload.cc : [],
          bcc: payload?.bcc?.length > 0 ? payload.bcc : [],
          attachments: payload.attachments || [],
          draft_status: true,
          from: mail_address,
          forward_message: payload.forward_message
        }

        const message = await this.messageService.create(payloadMessage)

        const conversation = await this.conversation.findById(payload.conversation_id.toString())

        if (!conversation) {
          throw new BadRequest(MESSAGES.CONVERSATION_NOT_FOUND)
        }

        conversation.has_attachments = conversation.has_attachments || message.attachments.length > 0
        conversation.last_message_date = message.draft_date
        conversation.draft_status = true
        conversation.read_status = true
        conversation.messages.push(message._id)

        await conversation.save()

        return { conversation: await conversation.populate('messages') }
      } else {
        // update the forward draft message
        const message = await this.messageService.updateMessageById(payload.message_id.toString(), {
          ...payload,
          draft_status: true,
          from: mail_address
        })

        if (!message) throw new BadRequest(MESSAGES.MESSAGE_NOT_FOUND)

        const conversation = await this.conversation.updateById(payload.conversation_id.toString(), {
          has_attachments: !!payload?.attachments?.length
        })

        if (!conversation) {
          throw new BadRequest(MESSAGES.CONVERSATION_NOT_FOUND)
        }

        return { conversation: await conversation.populate('messages') }
      }
    }

    // handle save normal draft message
    if (!payload.message_id && !payload.conversation_id) {
      const message = await this.messageService.create({
        ...payload,
        draft_date: new Date(Date.now()),
        draft_status: true,
        from: mail_address
      })

      if (!payload.conversation_id) {
        const conversation = await this.conversation.create({
          subject: payload.subject,
          slug: slugify(payload.subject),
          has_attachments: !!payload?.attachments?.length,
          last_message_date: new Date(Date.now()),
          participant_mail: [mail_address, ...(payload.to || []), ...(payload.cc || []), ...(payload.bcc || [])],
          mail_address: mail_address,
          draft_status: true,
          read_status: true,
          messages: [message._id]
        })

        return { conversation: await conversation.populate('messages') }
      } else {
        const conversation = await this.conversation.findById(payload.conversation_id)
        if (!conversation) {
          throw new BadRequest(MESSAGES.CONVERSATION_NOT_FOUND)
        }

        conversation.has_attachments = conversation.has_attachments || message.attachments.length > 0
        conversation.last_message_date = message.draft_date
        conversation.draft_status = true
        conversation.read_status = true
        conversation.messages.push(message._id)

        await conversation.save()
        return { conversation: await conversation.populate('messages') }
      }
    }

    // handle update normal draft message
    if (payload.message_id && payload.conversation_id) {
      const message = await this.messageService.updateMessageById(payload.message_id.toString(), {
        ...payload,
        draft_status: true,
        from: mail_address
      })

      if (!message) throw new BadRequest(MESSAGES.MESSAGE_NOT_FOUND)

      const conversation = await this.conversation.updateById(payload.conversation_id.toString(), {
        subject: payload.subject,
        slug: slugify(payload.subject),
        has_attachments: !!payload?.attachments?.length,
        last_message_date: new Date(Date.now()),
        participant_mail: [mail_address, ...(payload.to || []), ...(payload.cc || []), ...(payload.bcc || [])],
        mail_address: mail_address,
        draft_status: true,
        read_status: true
      })

      if (!conversation) {
        throw new BadRequest(MESSAGES.CONVERSATION_NOT_FOUND)
      }
      return { conversation: await conversation.populate('messages') }
    }
  }

  async sendMessage(mail_address: string, payload: SendMessage) {
    if (!payload.to && !payload.cc && !payload.bcc) {
      throw new BadRequest(MESSAGES.PROVIDE_RECIPIENT)
    }

    const validMailAddress = [...(payload.to || []), ...(payload.cc || []), ...(payload.bcc || [])].every((email) => {
      return MAIL_ADDRESS_RULE.test(email)
    })

    if (!validMailAddress) {
      throw new BadRequest(MESSAGES.INVALID_MAIL_ADDRESS)
    }

    // Prepare message
    const payloadMessage: Partial<IMessage> = {
      subject: payload.subject,
      body: payload.body,
      to: payload?.to?.length > 0 ? payload.to : [],
      cc: payload?.cc?.length > 0 ? payload.cc : [],
      bcc: payload?.bcc?.length > 0 ? payload.bcc : [],
      attachments: payload.attachments || [],
      draft_status: false,
      sent_date: new Date(Date.now()),
      from: mail_address
    }

    const message = await this.messageService.updateMessageById(payload.message_id.toString(), payloadMessage)
    if (!message) {
      throw new BadRequest(MESSAGES.MESSAGE_NOT_FOUND)
    }

    const recipients = [...message.to, ...message.cc]
    const bccRecipients = message.bcc

    // Handle to and cc recipients
    if (recipients.length > 0) {
      const payloadConversationSender: Partial<IConversation> = {
        participant_mail: [...recipients, ...bccRecipients],
        subject: message.subject,
        slug: slugify(message.subject),
        has_attachments: message.attachments.length > 0,
        last_message_date: message.sent_date,
        draft_status: false,
        sent_status: true,
        read_status: true
      }

      await Promise.all([
        this.conversation.updateById(payload.conversation_id.toString(), payloadConversationSender),
        ...recipients.map((recipient) => {
          const payloadConversation: Partial<IConversation> = {
            subject: message.subject,
            mail_address: recipient,
            slug: slugify(message.subject),
            has_attachments: message.attachments.length > 0,
            last_message_date: message.sent_date,
            participant_mail: [mail_address, ...recipients.filter((r) => r !== recipient)],
            inbox_status: true,
            read_status: false,
            messages: [message._id]
          }
          return this.conversation.create(payloadConversation)
        })
      ])
    }
    // Handle BCC recipients
    if (bccRecipients.length > 0) {
      const payloadConversationSender: Partial<IConversation> = {
        participant_mail: [...recipients, ...bccRecipients],
        subject: message.subject,
        slug: slugify(message.subject),
        has_attachments: message.attachments.length > 0,
        last_message_date: message.sent_date,
        draft_status: false,
        sent_status: true,
        read_status: true
      }

      await Promise.all([
        this.conversation.updateById(payload.conversation_id.toString(), payloadConversationSender),
        ...bccRecipients.map((recipient) => {
          const payloadConversation: Partial<IConversation> = {
            subject: message.subject,
            mail_address: recipient,
            slug: slugify(message.subject),
            has_attachments: message.attachments.length > 0,
            last_message_date: message.sent_date,
            participant_mail: [mail_address, recipient],
            inbox_status: true,
            messages: [message._id]
          }
          return this.conversation.create(payloadConversation)
        })
      ])
    }

    const conversation = await this.conversation.findById(payload.conversation_id.toString())

    if (!conversation) {
      throw new BadRequest(MESSAGES.CONVERSATION_NOT_FOUND)
    }
    return {
      conversation: await conversation.populate('messages')
    }
  }

  async replyMessage(mail_address: string, payload: ReplyMessage) {
    const replyMessage = await this.messageService.findById(payload.reply_message.toString())

    if (!replyMessage) {
      throw new BadRequest(MESSAGES.MESSAGE_NOT_FOUND)
    }

    const orginalMessage = !replyMessage.orginal_message
      ? replyMessage
      : await this.messageService.findById(replyMessage.orginal_message.toString())

    if (!orginalMessage) {
      throw new BadRequest(MESSAGES.MESSAGE_NOT_FOUND)
    }

    const isReplyFromNormalParticipant = [...orginalMessage.to, ...orginalMessage.cc].includes(mail_address)
    const isReplyFromBcc = orginalMessage?.bcc?.includes(mail_address)
    const payloadMessage: Partial<IMessage> = {
      subject: 'Re: ' + orginalMessage.subject,
      body: payload.body,
      to: [replyMessage.from],
      cc: [],
      bcc: [],
      attachments: payload.attachments || [],
      draft_status: false,
      sent_date: new Date(Date.now()),
      from: mail_address,
      reply_message: replyMessage._id,
      orginal_message: orginalMessage._id
    }

    const message = await this.messageService.updateMessageById(payload.message_id.toString(), payloadMessage)

    if (!message) {
      throw new BadRequest(MESSAGES.MESSAGE_NOT_FOUND)
    }

    if (isReplyFromNormalParticipant) {
      const conversationParticipant = [...orginalMessage.to, ...orginalMessage.cc, orginalMessage.from].filter(
        (participant) => participant !== mail_address
      )

      const conversation = await this.conversation.findById(payload.conversation_id.toString())
      if (!conversation) {
        throw new BadRequest(MESSAGES.CONVERSATION_NOT_FOUND)
      }

      conversation.has_attachments = conversation.has_attachments || message.attachments.length > 0
      conversation.last_message_date = message.sent_date
      conversation.sent_status = true
      conversation.draft_status = false
      conversation.read_status = true

      await Promise.all([
        conversation.save(),
        ...conversationParticipant.map(async (participant) => {
          const conversation = await this.conversation.findOne({
            participant_mail: participant,
            messages: { $in: [orginalMessage._id] }
          })

          if (!conversation) {
            throw new BadRequest(MESSAGES.CONVERSATION_NOT_FOUND)
          }

          conversation.messages.push(message._id)
          conversation.has_attachments = conversation.has_attachments || message.attachments.length > 0
          conversation.last_message_date = message.sent_date
          conversation.read_status = false
          conversation.inbox_status = true

          return conversation.save()
        })
      ])
    }

    if (isReplyFromBcc) {
      const conversation = await this.conversation.findById(payload.conversation_id.toString())
      if (!conversation) {
        throw new BadRequest(MESSAGES.CONVERSATION_NOT_FOUND)
      }

      conversation.has_attachments = conversation.has_attachments || message.attachments.length > 0
      conversation.last_message_date = message.sent_date
      conversation.sent_status = true
      conversation.draft_status = false
      conversation.read_status = true

      const conversationParticipant = await this.conversation.findOne({
        participant_mail: orginalMessage.from,
        messages: { $in: [orginalMessage._id] }
      })

      if (!conversationParticipant) {
        throw new BadRequest(MESSAGES.CONVERSATION_NOT_FOUND)
      }

      conversationParticipant.messages.push(message._id)
      conversationParticipant.has_attachments =
        conversationParticipant.has_attachments || message.attachments.length > 0
      conversationParticipant.last_message_date = message.sent_date
      conversationParticipant.read_status = false
      conversationParticipant.inbox_status = true

      await Promise.all([conversation.save(), conversationParticipant.save()])
    }
    const conversation = await this.conversation.findById(payload.conversation_id.toString())
    return {
      conversation: await conversation?.populate('messages')
    }
  }

  async fowardMessage(mail_address: string, payload: ForwardMessage) {
    if (!payload.to && !payload.cc && !payload.bcc) {
      throw new BadRequest(MESSAGES.PROVIDE_RECIPIENT)
    }

    const validMailAddress = [...(payload.to || []), ...(payload.cc || []), ...(payload.bcc || [])].every((email) => {
      return MAIL_ADDRESS_RULE.test(email)
    })

    if (!validMailAddress) {
      throw new BadRequest(MESSAGES.INVALID_MAIL_ADDRESS)
    }

    const forwardMessage = await this.messageService.findById(payload.forward_message.toString())

    if (!forwardMessage) {
      throw new BadRequest(MESSAGES.MESSAGE_NOT_FOUND)
    }

    const orginalMessage = !forwardMessage.orginal_message
      ? forwardMessage
      : await this.messageService.findById(forwardMessage.orginal_message.toString())

    if (!orginalMessage) {
      throw new BadRequest(MESSAGES.MESSAGE_NOT_FOUND)
    }

    const payloadMessage: Partial<IMessage> = {
      subject: 'Fwd: ' + forwardMessage.subject,
      body:
        '---------- Forwarded message ----------' +
        '\n\n' +
        'From: ' +
        forwardMessage.from +
        '\n' +
        'Date: ' +
        forwardMessage.sent_date +
        'Subject: ' +
        forwardMessage.subject +
        '\n' +
        'To: ' +
        forwardMessage.to.join(', ') +
        '\n' +
        forwardMessage.body,

      to: payload?.to?.length > 0 ? payload.to : [],
      cc: payload?.cc?.length > 0 ? payload.cc : [],
      bcc: payload?.bcc?.length > 0 ? payload.bcc : [],
      attachments: payload.attachments || [],
      draft_status: false,
      sent_date: new Date(Date.now()),
      from: mail_address,
      orginal_message: forwardMessage.orginal_message || forwardMessage._id,
      forward_message: payload.forward_message
    }

    const message = await this.messageService.updateMessageById(payload.message_id.toString(), payloadMessage)

    if (!message) {
      throw new BadRequest(MESSAGES.MESSAGE_NOT_FOUND)
    }

    const recipients = [...message.to, ...message.cc]

    console.log('recipients', recipients)

    const bccRecipients = message.bcc

    // case when forward message is from normal participant
    if (recipients.length > 0) {
      const conversation = await this.conversation.findById(payload.conversation_id.toString())
      if (!conversation) {
        throw new BadRequest(MESSAGES.CONVERSATION_NOT_FOUND)
      }

      console.log('participants', conversation.participant_mail)

      await Promise.all([
        ...recipients.map(async (recipient) => {
          if (conversation.participant_mail.includes(recipient)) {
            const conversation = await this.conversation.findOne({
              mail_address: recipient,
              messages: { $in: [orginalMessage._id] }
            })

            if (!conversation) {
              throw new BadRequest(MESSAGES.CONVERSATION_NOT_FOUND)
            }

            conversation.messages.push(message._id)
            conversation.has_attachments = conversation.has_attachments || message.attachments.length > 0
            conversation.last_message_date = message.sent_date
            conversation.read_status = false
            conversation.inbox_status = true

            return conversation.save()
          } else {
            const payloadConversation: Partial<IConversation> = {
              subject: message.subject,
              mail_address: recipient,
              slug: slugify(message.subject),
              has_attachments: message.attachments.length > 0,
              last_message_date: message.sent_date,
              participant_mail: [mail_address, ...recipients.filter((r) => r !== recipient)],
              inbox_status: true,
              read_status: false,
              messages: [message._id]
            }
            return this.conversation.create(payloadConversation)
          }
        })
      ])

      conversation.participant_mail = Array.from(new Set([...recipients, ...conversation.participant_mail]))
      conversation.has_attachments = conversation.has_attachments || message.attachments.length > 0
      conversation.last_message_date = message.sent_date
      conversation.sent_status = true
      conversation.draft_status = false
      conversation.read_status = true

      await conversation.save()
    }

    if (bccRecipients.length > 0) {
      const conversation = await this.conversation.findById(payload.conversation_id.toString())
      if (!conversation) {
        throw new BadRequest(MESSAGES.CONVERSATION_NOT_FOUND)
      }

      await Promise.all([
        ...bccRecipients.map(async (recipient) => {
          const payloadConversation: Partial<IConversation> = {
            subject: message.subject,
            mail_address: recipient,
            slug: slugify(message.subject),
            has_attachments: message.attachments.length > 0,
            last_message_date: message.sent_date,
            participant_mail: [mail_address, recipient],
            inbox_status: true,
            messages: [message._id]
          }
          return this.conversation.create(payloadConversation)
        })
      ])

      conversation.participant_mail = Array.from(new Set([...bccRecipients, ...conversation.participant_mail]))
      conversation.has_attachments = conversation.has_attachments || message.attachments.length > 0
      conversation.last_message_date = message.sent_date
      conversation.sent_status = true
      conversation.draft_status = false
      await conversation.save()
    }

    const conversation = await this.conversation.findById(payload.conversation_id.toString())

    return {
      conversation: await conversation?.populate('messages')
    }
  }

  async discardMessage(mail_address: string, conversation_id: string, message_id: string) {
    const conversation = await this.conversation.findOne({
      _id: conversation_id,
      participant_mail: mail_address
    })

    if (!conversation) {
      throw new BadRequest(MESSAGES.CONVERSATION_NOT_FOUND)
    }

    const isContainMessage = conversation.messages.map((i) => i.toString()).includes(message_id)

    if (!isContainMessage) {
      throw new BadRequest(MESSAGES.MESSAGE_NOT_FOUND)
    }

    conversation.messages = conversation.messages.filter((i) => i.toString() !== message_id)

    if (conversation.messages.length === 0) {
      return Promise.all([
        this.messageService.deleteMessageById(message_id),
        this.conversation.deleteConversationById(conversation_id)
      ])
    }

    return this.messageService.deleteMessageById(message_id)
  }

  async toggleAutoReply(mail_address: string, payload: { message_reply?: string }) {
    const mailBox = await this.repository.findOne({
      mail_address
    })

    if (!mailBox) {
      throw new BadRequest()
    }

    mailBox.auto_reply_message = payload.message_reply ? payload.message_reply : mailBox.auto_reply_message
    mailBox.auto_reply_enabled = !mailBox.auto_reply_enabled

    await mailBox.save()

    return {
      _id: mailBox._id
    }
  }

  create(mail_address: string) {
    return this.repository.create({ mail_address })
  }

  findByUser(user: string) {
    return this.repository.findByUser(user)
  }
}
