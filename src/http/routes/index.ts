import express from 'express'
import { ROUTE_APP } from './route-config-app'
import { RouteUser } from './user.route'
import { AttachmentRoute } from './attachment.route'
import { MailBoxRoute } from './mail-box.route'
const router = express.Router()

// user API
router.use(ROUTE_APP.users.path, RouteUser)

// attachment API
router.use(ROUTE_APP.attchments.path, AttachmentRoute)

// mail box API
router.use(ROUTE_APP.mailBox.path, MailBoxRoute)

// label API
router.use(ROUTE_APP.labels.path, AttachmentRoute)

export default router
