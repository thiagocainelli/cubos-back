export const smtpEmailConstant = async (): Promise<{
  transporter: any;
  emailSender: string;
}> => {
  const emailSender = process.env.EMAIL_SENDER;
  const emailHost = process.env.EMAIL_HOST;
  const emailPort = process.env.EMAIL_PORT;
  const emailUser = process.env.EMAIL_USER;
  const emailPassword = process.env.EMAIL_PASSWORD;

  if (emailSender && emailHost && emailPort && emailUser && emailPassword) {
    const nodemailer = require('nodemailer');

    const transporter = nodemailer.createTransport({
      host: emailHost,
      port: Number(emailPort),
      auth: {
        user: emailUser,
        pass: emailPassword,
      },
    });
    return {
      transporter: transporter,
      emailSender: emailSender,
    };
  } else {
    throw new Error('Smtp Email Keys not found');
  }
};
