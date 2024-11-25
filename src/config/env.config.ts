import 'dotenv/config'
import { DtoEnv } from '~//dtos/env.dto'
import { nameStrateryValidation } from '~/http/routes/route-config-app'
import { validation } from '~/utils'

const envData = validation<DtoEnv>(nameStrateryValidation.ENV_STRATEGY, process.env)
if (!envData) {
  process.exit(1)
}

const env = {
  DB_NAME: envData.DB_NAME,
  DB_URI: envData.DB_URI,
  APP_PORT: envData.PORT,
  BUILD_MODE: envData.BUILD_MODE,
  SMTP_HOST: envData.SMTP_HOST,
  SMTP_PORT: envData.SMTP_PORT,
  SMTP_SERVICE: envData.SMTP_SERVICE,
  SMTP_MAIL: envData.SMTP_MAIL,
  SMTP_PASSWORD: envData.SMTP_PASSWORD,
  CLIENT_URL: envData.CLIENT_URL,
  AT_JWT_SECRET: envData.AT_JWT_SECRET,
  AT_EXPIRES_IN: envData.AT_JWT_EXPIRES_IN,
  RT_JWT_SECRET: envData.RT_JWT_SECRET,
  RT_EXPIRES_IN: envData.RT_JWT_EXPIRES_IN,
  COOKIE_SECRET: envData.COOKIE_SECRET,
  COUDINARY_CLOUD_NAME: envData.CLOUDINARY_CLOUD_NAME,
  CLOUDINARY_API_KEY: envData.CLOUDINARY_API_KEY,
  CLOUDINARY_API_SECRET: envData.CLOUDINARY_API_SECRET,
  CLOUDINARY_FOLDER: envData.CLOUDINARY_FOLDER,
  REDIS_URI: envData.REDIS_URI
}

export default env
