import express from 'express'
import { container } from '~/config/inversify.config'
import { catchErrorHandler } from '../middlewares/catch-error-handler'
import { validationPipe } from '../middlewares/validationPipe'
import { ROUTE_APP } from './route-config-app'
import { isAuthorized } from '../middlewares/authorized'
import { MailBoxController } from '../controllers/mail-box.controller'

const MailBoxRoute = express.Router()

const mailBoxController = container.get<MailBoxController>(MailBoxController)

MailBoxRoute.route(ROUTE_APP.mailBox.child.darftMessage.path).post(
  isAuthorized,
  validationPipe(),
  catchErrorHandler(mailBoxController.darftMessage.bind(mailBoxController))
)

MailBoxRoute.route(ROUTE_APP.mailBox.child.send.path).post(
  isAuthorized,
  validationPipe(),
  catchErrorHandler(mailBoxController.sendMessage.bind(mailBoxController))
)

MailBoxRoute.route(ROUTE_APP.mailBox.child.reply.path).post(
  isAuthorized,
  validationPipe(),
  catchErrorHandler(mailBoxController.replyMessage.bind(mailBoxController))
)

MailBoxRoute.route(ROUTE_APP.mailBox.child.forward.path).post(
  isAuthorized,
  validationPipe(),
  catchErrorHandler(mailBoxController.forwardMessage.bind(mailBoxController))
)

MailBoxRoute.route(ROUTE_APP.mailBox.child.discardMessage.path).delete(
  isAuthorized,
  validationPipe({ routeParams: ['conversation_id', 'message_id'] }),
  catchErrorHandler(mailBoxController.discardMessage.bind(mailBoxController))
)

MailBoxRoute.route(ROUTE_APP.mailBox.child.toggleAutoReply.path).post(
  isAuthorized,
  validationPipe(),
  catchErrorHandler(mailBoxController.toggleAutoReply.bind(mailBoxController))
)

export { MailBoxRoute }
