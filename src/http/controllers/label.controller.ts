import { Request, Response } from 'express'
import { inject, injectable } from 'inversify'
import { LabelService } from '~/services/label.service'
import { CreatedResponse, OKResponse } from '~/utils/success-response.util'

const MESSAGES = {
  CREATE_SUCCESS: 'Create label was successfully',
  DELETE_SUCCESS: 'Delete label was successfully',
  UPDATE_SUCCESS: 'Update label was successfully'
}

@injectable()
export class LabelController {
  constructor(@inject(LabelService) private labelService: LabelService) {}

  async createLabel(req: Request, res: Response) {
    const data = await this.labelService.createLabel(req.mail_address, req.body)
    return new CreatedResponse(data, MESSAGES.CREATE_SUCCESS).send(req, res)
  }

  async deleteLabel(req: Request, res: Response) {
    const data = await this.labelService.deleteLabel(req.params.id)
    return new OKResponse(data, MESSAGES.DELETE_SUCCESS).send(req, res)
  }

  async updateLabel(req: Request, res: Response) {
    const data = await this.labelService.updateLabel(req.params.id, req.body)
    return new OKResponse(data, MESSAGES.UPDATE_SUCCESS).send(req, res)
  }
}
