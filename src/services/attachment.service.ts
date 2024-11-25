import { inject, injectable } from 'inversify'
import { AttachmentRepository } from '~/repositories/attachment.repository'
import { slugify } from '~/utils'
import { NAME_SERVICE_INJECTION } from '~/utils/constant.util'
import uploadImageService from './upload-image.service'
import cloudinary from '~/config/cloudinary.config'

@injectable()
export class AttachmentService {
  constructor(
    @inject(NAME_SERVICE_INJECTION.ATTACHMENT_REPOSITORY) private attachmentRepository: AttachmentRepository
  ) {}

  async uploadAttachment(file: Express.Multer.File, mail_address: string) {
    const mine_type = file.mimetype
    const size = file.size / 1024
    const name = file.originalname
    const slug = slugify(name.split('.')[0])
    const resCloud = await uploadImageService.streamUpload(file.buffer, 'attachments')
    const attachment = await this.attachmentRepository.create({
      mail_address,
      mime_type: mine_type,
      size,
      url: resCloud.secure_url,
      url_id: resCloud.public_id,
      name,
      slug
    })

    return attachment
  }

  async deleteAttachment(attachmentId: string, { url_id }: { url_id: string }) {
    console.log(url_id)
    const res = await cloudinary.uploader.destroy(url_id)
    if (res.result === 'ok') {
      return this.attachmentRepository.findByIdAndDelete(attachmentId)
    }
    return
  }
}
