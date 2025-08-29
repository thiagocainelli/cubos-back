import { CreateEmailResponseSuccess, Resend } from 'resend';

export const sendEmailService = async (
  recipient: string | string[],
  subject: string,
  content: string,
): Promise<CreateEmailResponseSuccess | null> => {
  const resendApiKey = process.env.RESEND_API_KEY;
  const emailSender = process.env.RESEND_EMAIL_SENDER;

  if (!resendApiKey || !emailSender) {
    console.error('❌ RESEND_API_KEY ou RESEND_EMAIL_SENDER ausentes.');
    return null;
  }

  const resend = new Resend(resendApiKey);

  try {
    const { data, error } = await resend.emails.send({
      from: emailSender,
      to: Array.isArray(recipient) ? recipient : [recipient],
      subject,
      html: content,
    });

    if (error) {
      console.error('❌ Resend retornou erro:', JSON.stringify(error, null, 2));
      return null;
    }

    console.log('✅ Resend aceitou o envio. ID:', data?.id);
    return data ?? null;
  } catch (err: any) {
    console.error('❌ Erro de transporte/SDK ao enviar:', err?.message ?? err);
    return null;
  }
};
