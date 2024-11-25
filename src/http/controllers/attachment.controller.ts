import { Request, Response } from 'express'
import { inject, injectable } from 'inversify'
import { AttachmentService } from '~/services/attachment.service'
import { BadRequest } from '~/utils/error-response.util'
import { CreatedResponse, OKResponse } from '~/utils/success-response.util'

const MESSAGES = {
  UPLOAD_SUCCESS: 'Upload file successfully',
  DESTROY_SUCCESS: 'Destroy file successfully'
}

@injectable()
export class AttachmentController {
  constructor(@inject(AttachmentService) private attachmentService: AttachmentService) {}

  async uploadAttachment(req: Request, res: Response) {
    if (!req.file) {
      throw new BadRequest('File is required')
    }
    const data = await this.attachmentService.uploadAttachment(req.file, req.mail_address)
    return new CreatedResponse(data, MESSAGES.UPLOAD_SUCCESS).send(req, res)
  }

  async deleteAttachment(req: Request, res: Response) {
    const data = await this.attachmentService.deleteAttachment(req.params.id, req.body)
    return new OKResponse(data, MESSAGES.DESTROY_SUCCESS).send(req, res)
  }
}
