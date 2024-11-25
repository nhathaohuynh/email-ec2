import multer from 'multer'
import { ALLOW_FILE_TYPE, LITMIT_COMMON_FILE_SIZE } from '~/utils/constant.util'
import { BadRequest } from '~/utils/error-response.util'

export const upload = multer({
  limits: { fileSize: LITMIT_COMMON_FILE_SIZE },
  fileFilter: (req, file, cb) => {
    if (!ALLOW_FILE_TYPE.includes(file.mimetype)) {
      const error = new BadRequest('File type is not supported')
      return cb(error)
    }

    cb(null, true)
  }
})
