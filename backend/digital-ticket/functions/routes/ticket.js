// src/routes/ticket.js
const express = require('express');
const { body, validationResult } = require('express-validator');
const { sendTicketEmail } = require('../services/mailService');
const { createPassObject } = require('../services/googleWalletService');
const QRCode = require('qrcode');
const admin = require('firebase-admin');
const { googleWallet, appleWallet } = require('../config');
const jwt = require('jsonwebtoken');

admin.initializeApp();
const db = admin.firestore();
const issuerId = googleWallet.issuerId;

const router = express.Router();

function requireApiKey(req, res, next) {
  const apiKey = req.header('x-api-key');
  if (!apiKey || apiKey !== process.env.EMAIL_API_KEY) {
    return res.status(401).json({ error: 'Unauthorized' });
  }
  next();
}

router.post(
  '/email',
  requireApiKey,
  [
    body('email').isEmail(),
    body('name').notEmpty(),
    body('code').notEmpty().withMessage('code is required'),
    body('serial').notEmpty().withMessage('serial is required'),
  ],
  async (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    try {
      const { email, name, code, serial } = req.body;
      const lookupCode = code;
      const suffix = email.replace(/[^\u0000-\u007F]+/g, '_');
      const objectId = `${issuerId}.${suffix}`;

      const qrBuffer = await QRCode.toBuffer(lookupCode, {
        width: 500,
        scale: 10,
        color: { dark: '#000000', light: '#FFFFFF' }
      });

      const googleWalletUrl = await createPassObject(email, name, lookupCode);

      const protocol = req.headers['x-forwarded-proto'] || req.protocol;
      const host = req.get('host');
      const baseUrl = `${protocol}://${host}`;

      const appleWalletPayload = { email, name, code: lookupCode, serial };
      const appleWalletJwt = jwt.sign(appleWalletPayload, appleWallet.jwtSecret);
      const appleWalletUrl = `${baseUrl}/api/tickets/apple-wallet-download?token=${appleWalletJwt}`;

      await sendTicketEmail(email, {
        name,
        code: lookupCode,
        serial,
        qrBuffer,
        googleWalletUrl,
        appleWalletUrl,
        appleWalletJwt,
      });

      res.json({ success: true, message: 'Email sent!', code: lookupCode, serial });
    } catch (err) {
      console.error('Failed to send ticket email:', err);
      next(err);
    }
  }
);

// Proxy endpoint for one-click Apple Wallet download
router.get('/apple-wallet-download', async (req, res) => {
  const token = req.query.token;
  if (!token) {
    return res.status(400).send('Missing token');
  }
  const protocol = req.headers['x-forwarded-proto'] || req.protocol;
  const host = req.get('host');
  const baseUrl = `${protocol}://${host}`;
  try {
    // Make a server-side request to /api/appleWallet/pass with Bearer token
    const fetch = require('node-fetch');
    const passRes = await fetch(`${baseUrl}/api/appleWallet/pass`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });
    if (!passRes.ok) {
      const text = await passRes.text();
      return res.status(passRes.status).send(text);
    }
    res.set({
      'Content-Type': passRes.headers.get('content-type'),
      'Content-Disposition': passRes.headers.get('content-disposition'),
      'Cache-Control': passRes.headers.get('cache-control'),
    });
    passRes.body.pipe(res);
  } catch (err) {
    console.error('Failed to proxy Apple Wallet pass:', err);
    res.status(500).send('Failed to download Apple Wallet pass');
  }
});

module.exports = router;
