import { CorsOptions } from 'cors'
import { WHITELISTED_ORIGINS } from '~/utils/constant.util'
import { ForbiddenError } from '~/utils/error-response.util'
import env from './env.config'

export const corsOptions: CorsOptions = {
  origin(requestOrigin, callback) {
    // Allow requests from postman. Normally postman will have orgin as undefined
    if (!requestOrigin && env.BUILD_MODE === 'development') {
      return callback(null, true)
    }

    if (WHITELISTED_ORIGINS.includes(requestOrigin as string)) {
      return callback(null, true)
    }

    return callback(new ForbiddenError('Not allowed by CORS'))
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  // allowedHeaders: ['Content-Type', 'Authorization'],
  optionsSuccessStatus: 200
}
