import express from 'express'
import { container } from '~/config/inversify.config'
import { catchErrorHandler } from '../middlewares/catch-error-handler'
import { validationPipe } from '../middlewares/validationPipe'
import { ROUTE_APP } from './route-config-app'
import { isAuthorized } from '../middlewares/authorized'
import { ConversationController } from '../controllers/conversation.controller'

const ConversationRoute = express.Router()

const conversationController = container.get<ConversationController>(ConversationController)

ConversationRoute.route(ROUTE_APP.conversation.child.search.path).get(
  isAuthorized,
  validationPipe(),
  catchErrorHandler(conversationController.searchConversation.bind(conversationController))
)

ConversationRoute.route(ROUTE_APP.conversation.child.getList.path).get(
  isAuthorized,
  validationPipe({ queryParams: ['status'] }),
  catchErrorHandler(conversationController.getList.bind(conversationController))
)

ConversationRoute.route(ROUTE_APP.conversation.child.getListByLabel.path).get(
  isAuthorized,
  catchErrorHandler(conversationController.getListByLabel.bind(conversationController))
)

ConversationRoute.route(ROUTE_APP.conversation.child.updateStatus.path).put(
  isAuthorized,
  validationPipe({ queryParams: ['status'] }),
  catchErrorHandler(conversationController.updateStatus.bind(conversationController))
)

ConversationRoute.route(ROUTE_APP.conversation.child.updaetLabel.path).put(
  isAuthorized,
  validationPipe({ routeParams: ['id'], queryParams: ['action'] }),
  catchErrorHandler(conversationController.labelConversation.bind(conversationController))
)

export { ConversationRoute }
