import express from 'express'
import { container } from '~/config/inversify.config'
import { catchErrorHandler } from '../middlewares/catch-error-handler'
import { validationPipe } from '../middlewares/validationPipe'
import { ROUTE_APP } from './route-config-app'
import { isAuthorized } from '../middlewares/authorized'
import { LabelController } from '../controllers/label.controller'

const LabelRoute = express.Router()

const labelController = container.get<LabelController>(LabelController)

LabelRoute.route(ROUTE_APP.labels.child.create.path).post(
  isAuthorized,
  validationPipe(),
  catchErrorHandler(labelController.createLabel.bind(labelController))
)

LabelRoute.route(ROUTE_APP.labels.child.delete.path).delete(
  isAuthorized,
  validationPipe({ routeParams: ['id'] }),
  catchErrorHandler(labelController.deleteLabel.bind(labelController))
)

LabelRoute.route(ROUTE_APP.labels.child.update.path).delete(
  isAuthorized,
  validationPipe({ routeParams: ['id'] }),
  catchErrorHandler(labelController.updateLabel.bind(labelController))
)

export { LabelRoute }
