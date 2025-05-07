const express = require('express');
const { body, validationResult } = require('express-validator');
const admin = require('firebase-admin');

const { createPassObject } = require('../services/googleWalletService');
// const { updateBoothVisited: updateAppleBooth } = require('../services/appleWalletService');

if (!admin.apps.length) {
    admin.initializeApp();
}

const db = admin.firestore();
const router = express.Router();

function requireApiKey(req, res, next) {
    const apiKey = req.header('x-api-key');
    if (!apiKey || apiKey !== process.env.EMAIL_API_KEY) {
        return res.status(401).json({ error: 'Unauthorized' });
    }
    next();
}

/**
 * POST /api/boothVisited
 * Body: { code: 'ABC123', boothVisited: 5 }
 */
router.post(
    '/boothVisited',
    requireApiKey,
    [
        body('code')
            .isAlphanumeric().withMessage('code must be alphanumeric')
            .isLength({ min: 6, max: 6 }).withMessage('code must be 6 chars'),
        body('boothVisited')
            .isInt({ min: 0 }).withMessage('boothVisited must be a non-negative integer'),
    ],
    async (req, res, next) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        const { code, boothVisited } = req.body;

        try {
            const ticketRef = db.collection('tickets').doc(code);
            const snap = await ticketRef.get();
            if (!snap.exists) {
                return res.status(404).json({ error: 'Ticket not found.' });
            }

            const { email, name, objectId } = snap.data();

            if (!email || !name) {
                return res.status(400).json({ error: 'Email or name not found in ticket.' });
            }
            await createPassObject(email, name, code, boothVisited);

            // await updateAppleBooth(email, name, code, boothVisited);

            return res.json({ success: true, boothVisited });
        } catch (err) {
            console.error('❌ Error updating boothVisited:', err);
            return next(err);
        }
    }
);

module.exports = router;
