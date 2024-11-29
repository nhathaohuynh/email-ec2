import { CreateLabel } from './../dtos/label.dto'
import { inject, injectable } from 'inversify'
import { LabelRepository } from '~/repositories/label.repository'
import { NAME_SERVICE_INJECTION } from '~/utils/constant.util'
import { BadRequest, ConflictError } from '~/utils/error-response.util'

const MESSAGES = {
  LABEL_EXISTING: 'Label is existing',
  LABEL_CREATE_FAILED: 'Failed to create label',
  LABEL_UPDATE_FAILED: 'Failed to update label'
}
@injectable()
export class LabelService {
  constructor(@inject(NAME_SERVICE_INJECTION.LABEL_REPOSIROTY) private labelRepository: LabelRepository) {}

  getLabels(mail_address: string) {
    return this.labelRepository.find({ mail_address })
  }

  async createLabel(mail_address: string, payload: CreateLabel) {
    const isExistingLabel = await this.labelRepository.findOne({ name: payload.name })
    if (isExistingLabel) {
      throw new ConflictError(MESSAGES.LABEL_EXISTING)
    }

    const label = await this.labelRepository.create({
      ...payload,
      mail_address
    })

    if (!label) {
      throw new BadRequest(MESSAGES.LABEL_CREATE_FAILED)
    }

    return label
  }

  async deleteLabel(labelId: string) {
    const res = await this.labelRepository.findByIdAndDelete(labelId)

    if (!res) {
      throw new BadRequest(MESSAGES.LABEL_UPDATE_FAILED)
    }

    return {
      _id: res._id
    }
  }

  async updateLabel(labelId: string, payload: CreateLabel) {
    const res = await this.labelRepository.findByIdAndUpdate(labelId, {
      $set: payload
    })

    if (!res) {
      throw new BadRequest(MESSAGES.LABEL_UPDATE_FAILED)
    }

    return {
      _id: res._id
    }
  }
}
