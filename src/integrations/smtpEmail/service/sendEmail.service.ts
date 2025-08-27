import { CreateEmailResponseSuccess, Resend } from 'resend';

export const sendEmailService = async (
  recipient: string,
  subject: string,
  content: string,
): Promise<CreateEmailResponseSuccess | null> => {
  try {
    const resendApiKey = process.env.RESEND_API_KEY;
    const emailSender = process.env.EMAIL_SENDER;
    const resend = new Resend(resendApiKey);

    if (!resendApiKey || !emailSender) {
      throw new Error(
        'Configurações de envio de email não encontradas. Contacte o administrador do sistema.',
      );
    }

    const emailOptions = {
      from: emailSender,
      to: recipient,
      subject: subject,
      html: content,
    };

    const response = await resend.emails.send(emailOptions);

    return response.data;
  } catch (error: any) {
    if (error && error.message) {
      return error.message;
    } else {
      throw new Error(
        'Configurações de envio de email não encontradas. Contacte o administrador do sistema.',
      );
    }
  }
};
