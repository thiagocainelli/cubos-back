import { smtpEmailConstant } from '../constants/smtp.constant';

export const sendEmailService = async (
  recipient: string,
  subject: string,
  typeContent: string, // text or html
  content: string,
): Promise<string | null> => {
  try {
    const { transporter, emailSender } = await smtpEmailConstant();

    if (transporter && emailSender) {
      let emailOptions: any = null;
      if (typeContent === 'text') {
        emailOptions = {
          from: emailSender,
          to: recipient,
          subject: subject,
          text: content,
        };
      } else if (typeContent === 'html') {
        emailOptions = {
          from: emailSender,
          to: recipient,
          subject: subject,
          html: content,
        };
      }

      if (emailOptions) {
        await transporter.sendMail(emailOptions);
        return null;
      } else {
        return 'Email options is null - typeContent is not valid';
      }
    } else {
      return 'SMTP config is not valid';
    }
  } catch (error: any) {
    if (error && error.message) {
      return error.message;
    } else {
      return 'SMTP config is not valid';
    }
  }
};
