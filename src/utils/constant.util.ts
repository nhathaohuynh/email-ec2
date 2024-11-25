export const API_PREFIX = '/api/v1/email'
export const HOST = 'http://localhost'

export const OBJECT_ID_RULE = /^[0-9a-fA-F]{24}$/

export const OBJECT_ID_RULE_MESSAGE = 'Your string fails to match the Object Id pattern!'

export const WHITELISTED_ORIGINS = ['http://localhost:5173']

export const BOARD_TYPES = {
  PUBLIC: 'public',
  PRIVATE: 'private'
}

export const INVALID_UPDATE_FIELDS = ['_id', 'createdAt']

export const NAME_SERVICE_INJECTION = {
  USER_REPOSITORY: 'UserRepository',
  MAIL_BOX_REPOSITORY: 'MailAddressRepository',
  ATTACHMENT_REPOSITORY: 'AttachmentRepository',
  LABEL_REPOSIROTY: 'LabelRepository',
  MESSAGE_REPOSITORY: 'MessageRepository',
  STATUS_CONVERSATION_REPOSITORY: 'StatusConversationRepository',
  CONVERSATION_REPOSITORY: 'ConversationRepository'
}

export const DOCUMENT_MODLE_REGISTRATION = {
  USER: 'user',
  MAIL_BOX: 'mail_box',
  MESSAGE: 'message',
  LABEL: 'label',
  CONVERSATION: 'conversation',
  STATUS_CONVERSATION: 'conversation_status',
  ATTACHMENT: 'attachment'
}

export const EMAIL_TEMPLATE_TWO_STEP_VERIFICATION = `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <style>
        body {
            font-family: Arial, sans-serif;
            background-color: #f4f4f4;
            margin: 0;
            padding: 0;
        }
        .email-container {
            max-width: 600px;
            margin: 50px auto;
            background-color: #fff;
            padding: 20px;
            border-radius: 8px;
            box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
        }
        .email-header {
            text-align: center;
            padding-bottom: 20px;
            border-bottom: 1px solid #ddd;
        }
        .email-header h1 {
            margin: 0;
            color: #333;
        }
        .email-body {
            padding: 20px;
        }
        .email-body p {
            color: #555;
            line-height: 1.6;
        }
        .verification-code {
            font-size: 24px;
            font-weight: bold;
            text-align: center;
            background-color: #f9f9f9;
            padding: 10px;
            border-radius: 4px;
            margin: 20px 0;
            color: #007bff;
        }
    </style>
</head>
<body>
    <div class="email-container">
        <div class="email-header">
            <h1>Two-Step Verification</h1>
        </div>
        <div class="email-body">
            <p>Thank you for securing your account. Please use the following verification code to complete the login process:</p>
            <div class="verification-code">{{verification_code}}</div>
            <p>If you did not request this, please ignore this email. The code will expire in 10 minutes.</p>
            <p>Best regards,</p>
            <p>&copy; 2024. All rights reserved.</p>
            <p>Contact with us: <a href="mailto:huynhnhathao0609@gmail.com">huynhnhathao0609@gmail.com</a></p>
        </div>
    </div>
</body>
</html>
`

export const EMAIL_TEMPLATE_RECOVERY_PASSWORD = `<!DOCTYPE html>
      <html lang="en">
      <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <style>
              body {
                  font-family: Arial, sans-serif;
                  background-color: #f4f4f4;
                  margin: 0;
                  padding: 0;
              }
              .email-container {
                  max-width: 600px;
                  margin: 50px auto;
                  background-color: #fff;
                  padding: 20px;
                  border-radius: 8px;
                  box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
              }
              .email-header {
                  text-align: center;
                  padding-bottom: 20px;
                  border-bottom: 1px solid #ddd;
              }
              .email-header h1 {
                  margin: 0;
                  color: #333;
              }
              .email-body {
                  padding: 20px;
              }
              .email-body p {
                  color: #555;
                  line-height: 1.6;
              }
              .new-password {
                  display: block;
                  width: 200px;
                  margin: 20px auto;
                  padding: 10px 20px;
                  text-align: center;
                  background-color: #28a745;
                  color: #fff !important;
                  text-decoration: none;
                  border-radius: 4px;
              }
              .new-password:hover {
                  background-color: #218838;
              }
          </style>
      </head>
      <body>
          <div class="email-container">
              <div class="email-header">
                  <h1>Password Recovery</h1>
              </div>
              <div class="email-body">
                  <p>We have successfully reset your password. Below is your new password, which you can use to log in:</p>
                  <p><strong>Your New Password: {{new_password}}</strong></p>
                  <p>For your security, we recommend that you change this password after logging in.</p>
                  <p>If you did not request a password reset, please contact us immediately.</p>
                  <p>Best regards,</p>
                  <p>&copy; 2024. All rights reserved.</p>
                  <p>Contact us: <a href="mailto:huynhnhathao0609@gmail.com">huynhnhathao0609@gmail.com</a></p>
              </div>
          </div>
      </body>
      </html>
`

export const LITMIT_COMMON_FILE_SIZE = 1024 * 1024 * 10 // 10MB

export const ALLOW_FILE_TYPE = ['image/png', 'image/jpg', 'image/jpeg']

export const DEFAULT_PAGE = 1

export const DEFAULT_ITEM__PER_PAGE = 12

export const DEFAULT_AVATAR =
  'https://www.shutterstock.com/image-vector/default-avatar-profile-icon-social-600nw-1677509740.jpg'

export const WINDOW_SIZE_IN_SECONDS = 60
export const MAX_REQUESTS = 1000

export const MAIL_ADDRESS_RULE = /^[a-zA-Z0-9._%+-]+@mvmanh.com/

export const PHONE_RULE = /^[0-9]{10}$/
