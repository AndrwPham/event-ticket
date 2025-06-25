const express = require('express');
const { createPassForUser } = require('../services/appleWalletService');
const jwt = require('jsonwebtoken');
const { appleWallet } = require('../config');
const router = express.Router();

function verifyTicketJWT(req, res) {
  const auth = req.header('Authorization') || '';
  if (!auth.startsWith('Bearer ')) {
    res.status(401).send('Missing or invalid Bearer token');
    return null;
  }
  const token = auth.slice('Bearer '.length);
  try {
    const payload = jwt.verify(token, appleWallet.jwtSecret);
    return payload;
  } catch (err) {
    res.status(401).send('Invalid or expired JWT');
    return null;
  }
}

router.get('/pass', async (req, res, next) => {
  try {
    // Accept all ticket data from JWT only
    const payload = verifyTicketJWT(req, res);
    if (!payload) return;
    const { email, name, code, serial, ...fields } = payload;
    if (!email || !code || !name || !serial) {
      return res.status(400).send('Missing parameters in JWT.');
    }
    const passBuffer = await createPassForUser(email, name, code, serial, fields);
    res
      .status(200)
      .set({
        'Content-Type': 'application/vnd.apple.pkpass',
        'Content-Disposition': `attachment; filename="${serial}.pkpass"`,
        'Cache-Control': 'no-store, no-cache'
      })
      .send(passBuffer);
  } catch (err) {
    console.error('❌ Error generating Apple pass:', err);
    next(err);
  }
});

module.exports = router;