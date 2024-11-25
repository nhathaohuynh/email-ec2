import express from 'express'
import { container } from '~/config/inversify.config'
import { catchErrorHandler } from '../middlewares/catch-error-handler'
import { validationPipe } from '../middlewares/validationPipe'
import { ROUTE_APP } from './route-config-app'
import { isAuthorized } from '../middlewares/authorized'
import { AttachmentController } from '../controllers/attachment.controller'
import { upload } from '../middlewares/multer-upload'

const AttachmentRoute = express.Router()

const attachmentController = container.get<AttachmentController>(AttachmentController)

AttachmentRoute.route(ROUTE_APP.attchments.child.upload.path).post(
  isAuthorized,
  upload.single('file'),
  validationPipe(),
  catchErrorHandler(attachmentController.uploadAttachment.bind(attachmentController))
)

AttachmentRoute.route(ROUTE_APP.attchments.child.delete.path).delete(
  isAuthorized,
  validationPipe({ routeParams: ['id'] }),
  catchErrorHandler(attachmentController.deleteAttachment.bind(attachmentController))
)

export { AttachmentRoute }
