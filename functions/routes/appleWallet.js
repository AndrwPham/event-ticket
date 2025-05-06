// routes/appleWallet.js
const express = require('express');
const { createPassForUser } = require('../services/appleWalletService');
const router = express.Router();

// GET /api/appleWallet/pass?email=foo@bar.com&code=XYZ123
router.get('/pass', async (req, res, next) => {
  try {
    const { email, name, code } = req.query;
    if (!email || !code || !name) {
      return res.status(400).send('Missing parameters.');
    }

    const passBuffer = await createPassForUser(email, name, code);

    res.set({
      'Content-Type': 'application/vnd.apple.pkpass',
      'Content-Disposition': `attachment; filename="${code}.pkpass"`,
      'Cache-Control': 'public, max-age=3600'
    });

    res.send(passBuffer);
  } catch (err) {
    next(err);
  }
});

module.exports = router;