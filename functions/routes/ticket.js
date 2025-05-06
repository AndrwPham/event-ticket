// src/routes/ticket.js
const express = require('express');
const { body, validationResult } = require('express-validator');
const { sendTicketEmail } = require('../services/mailService');
const { createPassObject } = require('../services/googleWalletService');
const QRCode = require('qrcode');

const router = express.Router();

// POST /api/tickets/email
router.post(
  '/email',
  [
    body('email').isEmail(),
    body('name').notEmpty(),
    body('code').notEmpty(),
  ],
  async (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    try {
      const { email, name, code } = req.body;

      const qrBuffer = await QRCode.toBuffer(code, {
        width: 500,
        scale: 10,
        color: { dark: '#000000', light: '#FFFFFF' }
      });

      const googleWalletUrl = await createPassObject(email, name, code);

      const protocol = req.headers['x-forwarded-proto'] || req.protocol;
      const host     = req.get('host');
      const baseUrl  = `${protocol}://${host}`;

      const appleWalletUrl = `${baseUrl}/api/appleWallet/pass`
        + `?email=${encodeURIComponent(email)}`
        + `&name=${encodeURIComponent(name)}`
        + `&code=${encodeURIComponent(code)}`;

      await sendTicketEmail(email, {
        name,
        code,
        qrBuffer,
        googleWalletUrl,
        appleWalletUrl,
      });

      return res.json({ success: true, message: 'Email sent successfully!' });
    } catch (err) {
      console.error('Failed to send ticket email:', err);
      next(err);
    }
  }
);

module.exports = router;
