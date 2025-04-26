const nodemailer = require('nodemailer');
const { smtp } = require('../config');
const { renderTemplate } = require('../utils/renderTemplate'); // import the template helper
const fs = require('fs');
const path = require('path');
const sharp = require('sharp');

const transporter = nodemailer.createTransport({
  host: smtp.host,
  port: smtp.port,
  secure: false, // upgrade with STARTTLS if needed
  auth: {
    user: smtp.user,
    pass: smtp.pass,
  },
});

const googlePngBuffer = sharp(
  path.join(__dirname, '../assets/google-wallet.svg')
)
  .resize({ width: 240 })
  .png()
  .toBuffer();

const applePngBuffer = sharp(
  path.join(__dirname, '../assets/apple-wallet.svg')
)
  .resize({ width: 240 })
  .png()
  .toBuffer();

// 3️⃣ Build base64 data URIs
const googleBtnDataUri = googlePngBuffer.toString('base64');
const appleBtnDataUri = applePngBuffer.toString('base64');

/**
 * Sends the ticket email.
 * @param {string} to      Recipient email address
 * @param {object} info    Template data and attachments
 *   - name: string           // User's name
 *   - code: string           // Ticket code
 *   - qrBuffer: Buffer       // QR code image buffer
 */
async function sendTicketEmail(to, info) {
  const qrAttachment = {
    filename: 'qrcode.png',
    content: info.qrBuffer,
    cid: 'qr',
    contentDisposition: 'inline'
  };

  const googleBtnPng = await sharp(
    path.join(__dirname, '../assets/google-wallet.svg')
  )
    .resize({ width: 240 })  // match your intended display size
    .png()
    .toBuffer();

  const appleBtnPng = await sharp(
    path.join(__dirname, '../assets/apple-wallet.svg')
  )
    .resize({ width: 240 })
    .png()
    .toBuffer();

  const googleBtnAttachment = {
    filename: 'google-wallet.png',
    content: googleBtnPng,
    cid: 'googleBtn',
    contentDisposition: 'inline',
    contentType: 'image/png'
  };

  const appleBtnAttachment = {
    filename: 'apple-wallet.png',
    content: appleBtnPng,
    cid: 'appleBtn',
    contentDisposition: 'inline',
    contentType: 'image/png'
  };

  const html = renderTemplate('ticket', {
    name: info.name,
    code: info.code,
    googleWalletUrl: info.googleWalletUrl,
    appleWalletUrl: info.appleWalletUrl
  });

  await transporter.sendMail({
    from: `"VGU Career Service" <${process.env.SMTP_USER}>`,
    to,
    subject: 'CFIED 2025 Ticket',
    html,
    attachments: [
      qrAttachment,
      googleBtnAttachment,
      appleBtnAttachment
    ]
  });
}

module.exports = { sendTicketEmail };
