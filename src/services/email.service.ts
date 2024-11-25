import nodemailer from 'nodemailer'
import env from '~/config/env.config'
import { EmailOptions } from '~/types'

class EmailService {
  sendSingleMail(options: EmailOptions) {
    const transporter = nodemailer.createTransport({
      host: env.SMTP_HOST,
      port: env.SMTP_PORT,
      service: env.SMTP_SERVICE,
      auth: {
        user: env.SMTP_MAIL,
        pass: env.SMTP_PASSWORD
      }
    })

    const mailOptions = {
      from: env.SMTP_MAIL,
      to: options.email,
      subject: options.subject,
      html: options.html
    }

    transporter.sendMail(mailOptions)
  }
}

export default new EmailService()
