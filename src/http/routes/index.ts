import express from 'express'
import { ROUTE_APP } from './route-config-app'
import { RouteUser } from './user.route'
import { AttachmentRoute } from './attachment.route'
import { MailBoxRoute } from './mail-box.route'
import { LabelRoute } from './label.route'
import { ConversationRoute } from './conversation.route'
const router = express.Router()

// check api
router.get('/check-status', (req, res) => {
  res.status(200).json({
    message: 'API is working',
    url: {
      user: ROUTE_APP.users.path,
      attachment: ROUTE_APP.attchments.path,
      mailBox: ROUTE_APP.mailBox.path,
      label: ROUTE_APP.labels.path
    }
  })
})

// user API
router.use(ROUTE_APP.users.path, RouteUser)

// attachment API
router.use(ROUTE_APP.attchments.path, AttachmentRoute)

// mail box API
router.use(ROUTE_APP.mailBox.path, MailBoxRoute)

// label API
router.use(ROUTE_APP.labels.path, LabelRoute)

// conversation API

router.use(ROUTE_APP.conversation.path, ConversationRoute)

export default router
