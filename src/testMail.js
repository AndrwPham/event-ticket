// testMail.js
require('dotenv').config();
const QRCode = require('qrcode');
const { sendTicketEmail } = require('./services/mailService');

async function main() {
  try {
    const qrBuffer = await QRCode.toBuffer('https://verify.example.com/TEST-CODE');
    await sendTicketEmail('10422021@student.vgu.edu.vn', {
      name:       'Test User',
      code:       'TEST-CODE',
      qrBuffer,
    });
  } catch (err) {
    console.error('❌ sendTicketEmail failed:', err);
  }
}

main();
