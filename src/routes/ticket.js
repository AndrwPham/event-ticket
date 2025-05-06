// src/routes/ticket.js
const express = require('express');
const { body, validationResult } = require('express-validator');
const { sendTicketEmail } = require('../services/mailService');
const { createPassObject } = require('../services/googleWalletService');
const { createPassForUser } = require('../services/appleWalletService');
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

      // Generate QR Code buffer
      const qrBuffer = await QRCode.toBuffer(`${code}`, {
        width: 500,
        scale: 10,
        color: {
          dark: '#000000',  // QR dark color
          light: '#FFFFFF'  // QR light background
        }
      });

      const googleWalletUrl = await createPassObject(email, name, code);

      const appleWalletUrl = `${process.env.APP_BASE_URL}/api/appleWallet/pass`
        + `?email=${encodeURIComponent(email)}`
        + `&name=${encodeURIComponent(name)}`
        + `&code=${encodeURIComponent(code)}`;

      // Send the ticket email
      await sendTicketEmail(email, {
        name,
        code,
        qrBuffer,
        googleWalletUrl: googleWalletUrl, // Placeholder for Google Wallet URL
        appleWalletUrl: appleWalletUrl, // Placeholder for Apple Wallet URL
      });

      return res.json({ success: true, message: 'Email sent successfully!' });
    } catch (err) {
      console.error('Failed to send ticket email:', err);
      next(err);
    }
  }
);

module.exports = router;
