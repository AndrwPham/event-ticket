import * as nodemailer from 'nodemailer';

describe('EmailProvider (Ethereal integration)', () => {
  it(
    'should send an email using Ethereal and provide a preview URL',
    async () => {
      const testAccount = await nodemailer.createTestAccount();
      const transporter = nodemailer.createTransport({
        host: testAccount.smtp.host,
        port: testAccount.smtp.port,
        secure: testAccount.smtp.secure,
        auth: {
          user: testAccount.user,
          pass: testAccount.pass,
        },
      });

      const info = await transporter.sendMail({
        from: 'Test <test@example.com>',
        to: 'recipient@example.com',
        subject: 'Hello Ethereal',
        text: 'This is a test email',
        html: '<b>This is a test email</b>',
      });

      const previewUrl = nodemailer.getTestMessageUrl(info);
      expect(info.messageId).toBeDefined();
      expect(previewUrl).toBeDefined();
      // Log after assertions to avoid Jest async warning
      console.log('Ethereal preview URL:', previewUrl);
    },
    20000
  );
});
