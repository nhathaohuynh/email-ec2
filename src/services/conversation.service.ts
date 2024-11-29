import { inject, injectable } from 'inversify'
import mongoose, { FilterQuery } from 'mongoose'
import { IConversation } from '~/databases/models/conversation.model'
import { ConversationRepository } from '~/repositories/conversation.repository'
import { ConversationStatus, SearchFields } from '~/types'
import { NAME_SERVICE_INJECTION } from '~/utils/constant.util'

@injectable()
export class ConversationService {
  constructor(
    @inject(NAME_SERVICE_INJECTION.CONVERSATION_REPOSITORY) private readonly repository: ConversationRepository
  ) {}

  getListConversation(mail_address: string, status: ConversationStatus) {
    const query: Record<string, string | boolean> = {
      mail_address: mail_address
    }

    switch (status) {
      case 'inbox':
        query.inbox_status = true
        break
      case 'starred':
        query.starred_status = true
        break
      case 'sent':
        query.sent_status = true
        break
      case 'draft':
        query.draft_status = true
        break
      case 'trash':
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

  async searchConversation(mail_address: string, payload: SearchFields) {
    const query: FilterQuery<IConversation> = {
      mail_address: mail_address
    }

    if (payload?.subject) {
      query.slug = {
        $regex: payload.subject,
        $options: 'i'
      }
    }

    if (payload?.has_attachments !== undefined) {
      query.has_attachments = payload.has_attachments
    }

    if (payload?.to) {
      query.participant_mail = {
        $in: [payload.to]
      }
    }

    if (payload?.fromDate && payload?.toDate) {
      if (payload.fromDate > payload.toDate) {
        throw new Error('fromDate must be earlier than toDate')
      }
      query.last_message_date = {
        $gte: payload.fromDate,
        $lte: payload.toDate
      }
    } else if (payload?.fromDate) {
      query.last_message_date = {
        $gte: payload.fromDate
      }
    } else if (payload?.toDate) {
      query.last_message_date = {
        $lte: payload.toDate
      }
    }

    return this.repository.find(query)
  }

  moveToTrash(conversation_id: string) {
    return this.repository.findByIdAndUpdate(conversation_id, {
      $set: {
        trash_status: true,
        inbox_status: false
      }
    })
  }

  moveToInbox(conversation_id: string) {
    return this.repository.findByIdAndUpdate(conversation_id, {
      $set: {
        trash_status: false,
        inbox_status: true
      }
    })
  }

  async toggleStarredStatus(conversation_id: string) {
    const conversation = await this.repository.findById(conversation_id)
    if (!conversation) {
      throw new Error('Conversation not found')
    }

    conversation.starred_status = !conversation.starred_status
    return conversation.save()
  }

  addLabel(conversation_id: string, { label_id }: { label_id: string }) {
    return this.repository.findByIdAndUpdate(conversation_id, {
      $addToSet: {
        labels: new mongoose.Types.ObjectId(label_id)
      }
    })
  }

  removeLabel(conversation_id: string, { label_id }: { label_id: string }) {
    return this.repository.findByIdAndUpdate(conversation_id, {
      $pull: {
        labels: new mongoose.Types.ObjectId(label_id)
      }
    })
  }

  async toggleReadStatus(conversation_id: string) {
    const conversation = await this.repository.findById(conversation_id)
    if (!conversation) {
      throw new Error('Conversation not found')
    }

    conversation.read_status = !conversation.read_status
    return conversation.save()
  }

  findOne(query: FilterQuery<IConversation>) {
    return this.repository.findOne(query)
  }

  create(payload: Partial<IConversation>) {
    return this.repository.create(payload)
  }

  findById(id: string) {
    return this.repository.findById(id)
  }

  updateById(id: string, payload: Partial<IConversation>) {
    return this.repository.findByIdAndUpdate(id, {
      $set: payload
    })
  }

  deleteConversationById(id: string) {
    return this.repository.findByIdAndDelete(id)
  }
}
