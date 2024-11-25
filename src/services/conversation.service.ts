import { inject, injectable } from 'inversify'
import { FilterQuery } from 'mongoose'
import { IConversation } from '~/databases/models/conversation.model'
import { ConversationRepository } from '~/repositories/conversation.repository'
import { NAME_SERVICE_INJECTION } from '~/utils/constant.util'

@injectable()
export class ConversationService {
  constructor(
    @inject(NAME_SERVICE_INJECTION.CONVERSATION_REPOSITORY) private readonly repository: ConversationRepository
  ) {}

  getListConversation(mail_address: string, status: 'Inbox' | 'Starred' | 'Sent' | 'Draft' | 'Trash') {
    const query: Record<string, string | boolean> = {
      mail_address: mail_address
    }

    switch (status) {
      case 'Inbox':
        query.inbox_status = true
        break
      case 'Starred':
        query.starred_status = true
        break
      case 'Sent':
        query.sent_status = true
        break
      case 'Draft':
        query.draft_status = true
        break
      case 'Trash':
        query.trash_status = true
        break
      default:
        throw new Error('Invalid status provided')
    }

    return this.repository.find(query)
  }

  async getconversationByLabel(mail_address: string, label_id: string) {
    return this.repository.find({
      mail_address: mail_address,
      labels: {
        $in: [label_id]
      }
    })
  }

  async searchBasicConversation(mail_address: string, keyword: string) {
    return this.repository.find({
      mail_address: mail_address,
      slug: {
        $regex: keyword,
        $options: 'i'
      }
    })
  }

  async searchAdvancedConversation(
    mail_address: string,
    payload: { keyword: string; has_attachments: boolean; to: string; fromDate: Date; toDate: Date }
  ) {
    const query: FilterQuery<IConversation> = {
      mail_address: mail_address
    }

    if (payload.keyword) {
      query.slug = {
        $regex: payload.keyword,
        $options: 'i'
      }
    }

    if (payload.has_attachments) {
      query.has_attachments = payload.has_attachments
    }

    if (payload.to) {
      query.participant_mail = {
        $in: [payload.to]
      }
    }

    if (payload.fromDate && payload.toDate) {
      query.last_message_date = {
        $gte: payload.fromDate,
        $lte: payload.toDate
      }
    }

    return this.repository.find(query)
  }

  moveToTrash(mail_address: string, conversation_id: string) {
    return this.repository.findByIdAndUpdate(conversation_id, {
      $set: {
        trash_status: true
      }
    })
  }

  moveToInbox(mail_address: string, conversation_id: string) {
    return this.repository.findByIdAndUpdate(conversation_id, {
      $set: {
        trash_status: false
      }
    })
  }

  starredConversation(mail_address: string, conversation_id: string) {
    return this.repository.findByIdAndUpdate(conversation_id, {
      $set: {
        starred_status: true
      }
    })
  }

  unstarredConversation(mail_address: string, conversation_id: string) {
    return this.repository.findByIdAndUpdate(conversation_id, {
      $set: {
        starred_status: false
      }
    })
  }

  async create(payload: Partial<IConversation>) {
    return this.repository.create(payload)
  }

  findById(id: string) {
    return this.repository.findById(id)
  }

  async updateById(id: string, payload: Partial<IConversation>) {
    return this.repository.findByIdAndUpdate(id, {
      $set: payload
    })
  }

  async deleteConversationById(id: string) {
    return this.repository.findByIdAndDelete(id)
  }

  async makeLabel(mail_address: string, conversation_id: string, label_id: string) {
    return this.repository.findByIdAndUpdate(conversation_id, {
      $push: {
        labels: label_id
      }
    })
  }

  async removeLabel(mail_address: string, conversation_id: string, label_id: string) {
    return this.repository.findByIdAndUpdate(conversation_id, {
      $pull: {
        labels: label_id
      }
    })
  }

  async makeRead(mail_address: string, conversation_id: string) {
    return this.repository.findByIdAndUpdate(conversation_id, {
      $set: {
        read_status: true
      }
    })
  }

  async makeUnread(mail_address: string, conversation_id: string) {
    return this.repository.findByIdAndUpdate(conversation_id, {
      $set: {
        read_status: false
      }
    })
  }

  findOne(query: FilterQuery<IConversation>) {
    return this.repository.findOne(query)
  }
}
