import { UploadApiResponse } from 'cloudinary'
import streamififer from 'streamifier'
import cloudinary from '~/config/cloudinary.config'
import { BadRequest } from '~/utils/error-response.util'

const MSG = {
  UPLOAD_FAILED: 'Upload file to cloudinary failed'
}

class UploadService {
  streamUpload(fileBuffer: Buffer | undefined, folderName: string): Promise<UploadApiResponse> {
    if (!fileBuffer) {
      throw new BadRequest(MSG.UPLOAD_FAILED)
    }
    return new Promise((resolve, reject) => {
      const stream = cloudinary.uploader.upload_stream({ folder: folderName }, (error, result) => {
        if (result) {
          resolve(result)
        } else {
          reject(error)
        }
      })
      streamififer.createReadStream(fileBuffer).pipe(stream)
    })
  }
}

export default new UploadService()
