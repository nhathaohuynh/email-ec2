import { API_PREFIX } from '~/utils/constant.util'

export const ROUTE_APP = {
  users: {
    path: '/users',
    child: {
      signIn: {
        path: '/sign-in',
        method: 'POST'
      },

      enableTowoStepVerification: {
        path: '/enable-two-step-verification',
        method: 'POST'
      },

      twoStepVerification: {
        path: '/verify-token',
        method: 'POST'
      },

      signUp: {
        path: '/sign-up',
        method: 'POST'
      },

      refreshToken: {
        path: '/refresh-token',
        method: 'GET'
      },

      logout: {
        path: '/log-out',
        method: 'DELETE'
      },

      updatePassword: {
        path: '/update-password',
        method: 'PUT'
      },

      updateInformation: {
        path: '/update-information',
        method: 'PUT'
      },

      recoveryPassword: {
        path: '/recovery-password',
        method: 'POST'
      }
    }
  },

  attchments: {
    path: '/attachments',
    child: {
      upload: {
        path: '',
        method: 'POST'
      },

      delete: {
        path: '/:id',
        method: 'DELETE'
      }
    }
  },

  labels: {
    path: '/labels',
    child: {
      create: {
        path: '',
        method: 'POST'
      },

      getList: {
        path: '',
        method: 'GET'
      },

      update: {
        path: '/:id',
        method: 'PUT'
      },
      delete: {
        path: '/:id',
        method: 'DELETE'
      }
    }
  },

  mailBox: {
    path: '/mail-box',
    child: {
      darftMessage: {
        path: '/draft-message',
        method: 'POST'
      },

      discardMessage: {
        path: '/discard-message/:conversation_id/:message_id',
        method: 'DELETE'
      },

      send: {
        path: '/send',
        method: 'POST'
      },

      reply: {
        path: '/reply',
        method: 'POST'
      },

      forward: {
        path: '/forward',
        method: 'POST'
      },

      toggleAutoReply: {
        path: '/toggle-auto-reply',
        method: 'POST'
      }
    }
  },

  conversation: {
    path: '/conversation',
    child: {
      getList: {
        path: '',
        method: 'GET'
      },

      getListByLabel: {
        path: '/label/:label_id',
        method: 'GET'
      },

      search: {
        path: '/search',
        method: 'GET'
      },

      updaetLabel: {
        path: '/:id/label',
        method: 'PUT'
      },

      updateStatus: {
        path: '/:id',
        method: 'PUT'
      }
    }
  }
}

export const nameStrateryValidation = {
  // env
  ENV_STRATEGY: 'ENV_STRATEGY',

  // user
  SIGNIN: `${API_PREFIX}${ROUTE_APP.users.path}${ROUTE_APP.users.child.signIn.path}:${ROUTE_APP.users.child.signIn.method}`,
  SIGNUP: `${API_PREFIX}${ROUTE_APP.users.path}${ROUTE_APP.users.child.signUp.path}:${ROUTE_APP.users.child.signUp.method}`,
  VERIFY_TOKEN: `${API_PREFIX}${ROUTE_APP.users.path}${ROUTE_APP.users.child.twoStepVerification.path}:${ROUTE_APP.users.child.twoStepVerification.method}`,
  UPDATE_PASSWORD: `${API_PREFIX}${ROUTE_APP.users.path}${ROUTE_APP.users.child.updatePassword.path}:${ROUTE_APP.users.child.updatePassword.method}`,
  UPDATE_INFORMATION: `${API_PREFIX}${ROUTE_APP.users.path}${ROUTE_APP.users.child.updateInformation.path}:${ROUTE_APP.users.child.updateInformation.method}`,
  RECOVERY_PASSWORD: `${API_PREFIX}${ROUTE_APP.users.path}${ROUTE_APP.users.child.recoveryPassword.path}:${ROUTE_APP.users.child.recoveryPassword.method}`,

  // ATTACHMENTS
  UPLOAD_ATTACHMENT: `${API_PREFIX}${ROUTE_APP.attchments.path}${ROUTE_APP.attchments.child.upload.path}:${ROUTE_APP.attchments.child.upload.method}`,
  DELETE_ATTACHMENT: `${API_PREFIX}${ROUTE_APP.attchments.path}${ROUTE_APP.attchments.child.delete.path}:${ROUTE_APP.attchments.child.delete.method}`,
  // LABELS
  CREATE_LABEL: `${API_PREFIX}${ROUTE_APP.labels.path}${ROUTE_APP.labels.child.create.path}:${ROUTE_APP.labels.child.create.method}`,
  UPDATE_LABEL: `${API_PREFIX}${ROUTE_APP.labels.path}${ROUTE_APP.labels.child.update.path}:${ROUTE_APP.labels.child.update.method}`,
  DELETE_LABEL: `${API_PREFIX}${ROUTE_APP.labels.path}${ROUTE_APP.labels.child.delete.path}:${ROUTE_APP.labels.child.delete.method}`,

  // MAIL BOX
  COMPOSE_MAIL: `${API_PREFIX}${ROUTE_APP.mailBox.path}${ROUTE_APP.mailBox.child.darftMessage.path}:${ROUTE_APP.mailBox.child.darftMessage.method}`,
  SEND_MAIL: `${API_PREFIX}${ROUTE_APP.mailBox.path}${ROUTE_APP.mailBox.child.send.path}:${ROUTE_APP.mailBox.child.send.method}`,
  REPLY_MAIL: `${API_PREFIX}${ROUTE_APP.mailBox.path}${ROUTE_APP.mailBox.child.reply.path}:${ROUTE_APP.mailBox.child.reply.method}`,
  FORWARD_MAIL: `${API_PREFIX}${ROUTE_APP.mailBox.path}${ROUTE_APP.mailBox.child.forward.path}:${ROUTE_APP.mailBox.child.forward.method}`,

  // CONVERSATION
  SEARCH_CONVERSATION: `${API_PREFIX}${ROUTE_APP.conversation.path}${ROUTE_APP.conversation.child.search.path}:${ROUTE_APP.conversation.child.search.method}`,
  LABEL_CONVERSATION: `${API_PREFIX}${ROUTE_APP.conversation.path}${ROUTE_APP.conversation.child.updaetLabel.path}:${ROUTE_APP.conversation.child.updaetLabel.method}`
}
