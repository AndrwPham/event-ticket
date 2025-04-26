const nodemailer = require('nodemailer');
const { smtp } = require('../config');
const { renderTemplate } = require('../utils/renderTemplate'); // import the template helper

const transporter = nodemailer.createTransport({
  host:     smtp.host,
  port:     smtp.port,
  secure:   false, // upgrade with STARTTLS if needed
  auth: {
    user: smtp.user,
    pass: smtp.pass,
  },
});

/**
 * Sends the ticket email.
 * @param {string} to      Recipient email address
 * @param {object} info    Template data and attachments
 *   - name: string           // User's name
 *   - code: string           // Ticket code
 *   - qrBuffer: Buffer       // QR code image buffer
 */
async function sendTicketEmail(to, info) {
  // Render HTML template, replacing placeholders
  const html = renderTemplate('ticket', {
    name:       info.name,
    code:       info.code,
  });

  // Send email with embedded QR code
  await transporter.sendMail({
    from: `"VGU Career Service" <${process.env.SMTP_USER}>`,
    to,
    subject: 'TEST TICKET',
    html,
    attachments: [
      {
        filename: 'qrcode.png',
        content:  info.qrBuffer,
        cid:      'qr', // must match <img src="cid:qr"> in template
      },
    ],
  });
}

module.exports = { sendTicketEmail };
