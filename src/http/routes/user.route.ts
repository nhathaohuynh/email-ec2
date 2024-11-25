import express from 'express'
import { container } from '~/config/inversify.config'
import { UserController } from '../controllers/user.controller'
import { isAuthorized } from '../middlewares/authorized'
import { catchErrorHandler } from '../middlewares/catch-error-handler'
import { upload } from '../middlewares/multer-upload'
import { validationPipe } from '../middlewares/validationPipe'
import { ROUTE_APP } from './route-config-app'

const RouteUser = express.Router()

const userController = container.get<UserController>(UserController)

RouteUser.route(ROUTE_APP.users.child.signIn.path).post(
  validationPipe(),
  catchErrorHandler(userController.signIn.bind(userController))
)

RouteUser.route(ROUTE_APP.users.child.signUp.path).post(
  validationPipe(),
  catchErrorHandler(userController.signUp.bind(userController))
)

RouteUser.route(ROUTE_APP.users.child.logout.path).delete(catchErrorHandler(userController.logout.bind(userController)))

RouteUser.route(ROUTE_APP.users.child.twoStepVerification.path).post(
  isAuthorized,
  validationPipe(),
  catchErrorHandler(userController.twoStepVerification.bind(userController))
)

RouteUser.route(ROUTE_APP.users.child.refreshToken.path).get(
  catchErrorHandler(userController.refreshToken.bind(userController))
)

RouteUser.route(ROUTE_APP.users.child.updatePassword.path).put(
  isAuthorized,
  validationPipe(),
  catchErrorHandler(userController.changePassword.bind(userController))
)

RouteUser.route(ROUTE_APP.users.child.updateInformation.path).put(
  isAuthorized,
  upload.single('avatar'),
  validationPipe(),
  catchErrorHandler(userController.updateInformation.bind(userController))
)

RouteUser.route(ROUTE_APP.users.child.recoveryPassword.path).post(
  validationPipe(),
  catchErrorHandler(userController.recoveryPassword.bind(userController))
)

export { RouteUser }
