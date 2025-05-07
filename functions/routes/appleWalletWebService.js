const express = require('express');
const admin = require('firebase-admin');
const path = require('path');
const { appleWallet } = require('../config');
const {
    initTemplate,
    createPassForUser
} = require('../services/appleWalletService');

const router = express.Router();
const db = admin.firestore();

initTemplate().catch(err => {
    console.error('❌ Failed to initialize Apple pass template:', err);
    process.exit(1);
});

/**
 * Middleware per Apple’s spec:
 *   Authorization: ApplePass {authenticationToken}
 */
function requireAppleToken(req, res, next) {
    const auth = req.header('Authorization') || '';
    if (!auth.startsWith('ApplePass ')) {
        // Apple expects a WWW-Authenticate header on 401
        return res
            .status(401)
            .set('WWW-Authenticate', 'ApplePass')
            .send('Unauthorized');
    }
    const token = auth.slice('ApplePass '.length);
    if (token !== appleWallet.authToken) {
        return res
            .status(401)
            .set('WWW-Authenticate', 'ApplePass')
            .send('Unauthorized');
    }
    next();
}

/**
 * GET /v1/devices/:deviceLibraryIdentifier/registrations/:passTypeIdentifier
 * Query-string: ?passesUpdatedSince=<UNIX-seconds>
 *
 * Responds with a JSON:
 * {
 *   serialNumbers: [ "…", "…" ],
 *   lastUpdated: 1351981923
 * }
 */
router.get(
    '/v1/devices/:deviceLibraryIdentifier/registrations/:passTypeIdentifier',
    requireAppleToken,
    async (req, res, next) => {
        try {
            const { deviceLibraryIdentifier, passTypeIdentifier } = req.params;
            const sinceParam = req.query.passesUpdatedSince;
            // Convert the query param to a Date (defaults to epoch)
            const sinceDate = sinceParam
                ? new Date(Number(sinceParam) * 1000)
                : new Date(0);

            // 1) Find all registrations for this device + pass type
            const regsSnap = await db
                .collection('registrations')
                .where('deviceLibraryIdentifier', '==', deviceLibraryIdentifier)
                .where('passTypeIdentifier', '==', passTypeIdentifier)
                .get();

            // If there are no registrations at all, return empty + now
            if (regsSnap.empty) {
                return res.json({
                    serialNumbers: [],
                    lastUpdated: Math.floor(Date.now() / 1000)
                });
            }

            // 2) For each registration, load the pass record and filter by updatedAt
            const serialNumbers = [];
            let maxUpdatedMs = sinceDate.getTime();

            for (const regDoc of regsSnap.docs) {
                const { passTypeIdentifier: ptid, serialNumber } = regDoc.data();
                // We store passes under "passes/{passTypeIdentifier_serialNumber}"
                const passId = `${ptid}_${serialNumber}`;
                const passSnap = await db.collection('passes').doc(passId).get();
                if (!passSnap.exists) continue;

                const passData = passSnap.data();
                const updatedAtTs = passData.updatedAt;  // should be a Firestore Timestamp

                if (
                    updatedAtTs &&
                    typeof updatedAtTs.toMillis === 'function'
                ) {
                    const updatedMs = updatedAtTs.toMillis();
                    if (updatedMs > sinceDate.getTime()) {
                        serialNumbers.push(passData.serialNumber);
                        if (updatedMs > maxUpdatedMs) {
                            maxUpdatedMs = updatedMs;
                        }
                    }
                }
            }

            const lastUpdated = serialNumbers.length
                ? Math.floor(maxUpdatedMs / 1000)
                : Number(sinceParam) || 0;

            return res.json({ serialNumbers, lastUpdated });
        } catch (err) {
            next(err);
        }
    }
);


/**
 * GET /v1/passes/:passTypeIdentifier/:serialNumber
 * — Called by Apple devices to fetch or refresh a .pkpass
 */
router.get(
    '/v1/passes/:passTypeIdentifier/:serialNumber',
    requireAppleToken,
    async (req, res, next) => {
        try {
            const { passTypeIdentifier, serialNumber } = req.params;

            // 1) Find your pass in Firestore by its serialNumber
            const ticketQuery = await db
                .collection('tickets')
                .where('serial', '==', serialNumber)
                .limit(1)
                .get();

            if (ticketQuery.empty) {
                return res.status(404).send('Pass not found');
            }

            const ticket = ticketQuery.docs[0].data();
            // ticket.code      → barcode value
            // ticket.email     → derive serialNumber in template
            // ticket.name      → display name
            // ticket.boothVisited

            // 2) Regenerate the .pkpass
            const passBuffer = await createPassForUser(
                ticket.email,
                ticket.name,
                ticket.code,
                ticket.boothVisited
            );

            // 3) Send it back with the correct headers
            res.set({
                'Content-Type': 'application/vnd.apple.pkpass',
                'Content-Disposition': `attachment; filename="${serialNumber}.pkpass"`,
                'Cache-Control': 'no-cache, no-store'
            });
            return res.send(passBuffer);

        } catch (err) {
            next(err);
        }
    }
);

/**
 * POST /v1/devices/:deviceLibraryIdentifier/registrations/:passTypeIdentifier/:serialNumber
 *
 */
// --- Register a pass for updates ---
router.post(
    '/v1/devices/:deviceLibraryIdentifier/registrations/:passTypeIdentifier/:serialNumber',
    requireAppleToken,
    async (req, res, next) => {
        try {
            const {
                deviceLibraryIdentifier,
                passTypeIdentifier,
                serialNumber
            } = req.params;
            const { pushToken } = req.body;

            if (!pushToken) {
                return res.status(400).send('Missing pushToken');
            }

            // 1) Ensure the pass exists in your Passes table
            const passId = `${passTypeIdentifier}_${serialNumber}`;
            await db
                .collection('passes')
                .doc(passId)
                .set(
                    {
                        passTypeIdentifier,
                        serialNumber,
                        // Optionally track a lastUpdated timestamp here.
                        updatedAt: admin.firestore.FieldValue.serverTimestamp()
                    },
                    { merge: true }
                );

            // 2) Upsert the device
            await db
                .collection('devices')
                .doc(deviceLibraryIdentifier)
                .set(
                    {
                        pushToken,
                        seenAt: admin.firestore.FieldValue.serverTimestamp()
                    },
                    { merge: true }
                );

            // 3) Create the registration mapping
            const regId = `${deviceLibraryIdentifier}_${passId}`;
            const regRef = db.collection('registrations').doc(regId);
            const regSnap = await regRef.get();

            if (regSnap.exists) {
                return res.status(200).send();
            }

            await regRef.set({
                deviceLibraryIdentifier,
                passId,
                passTypeIdentifier,
                serialNumber,
                registeredAt: admin.firestore.FieldValue.serverTimestamp()
            });

            return res.status(201).send();
        } catch (err) {
            next(err);
        }
    }
);

// --- Unregister a pass ---
router.delete(
    '/v1/devices/:deviceLibraryIdentifier/registrations/:passTypeIdentifier/:serialNumber',
    requireAppleToken,
    async (req, res, next) => {
        try {
            const {
                deviceLibraryIdentifier,
                passTypeIdentifier,
                serialNumber
            } = req.params;

            const passId = `${passTypeIdentifier}_${serialNumber}`;
            const regId = `${deviceLibraryIdentifier}_${passId}`;
            await db.collection('registrations').doc(regId).delete();

            const remaining = await db
                .collection('registrations')
                .where('deviceLibraryIdentifier', '==', deviceLibraryIdentifier)
                .limit(1)
                .get();
            if (remaining.empty) {
                await db.collection('devices').doc(deviceLibraryIdentifier).delete();
            }

            const stillUsed = await db
                .collection('registrations')
                .where('passId', '==', passId)
                .limit(1)
                .get();
            if (stillUsed.empty) {
                await db.collection('passes').doc(passId).delete();
            }

            return res.status(200).send();
        } catch (err) {
            next(err);
        }
    }
);

/**
 * POST /v1/push/:passTypeIdentifier
 * 
 * Header:
 *   Authorization: ApplePass <authenticationToken>
 * 
 * Body:
 *   { serialNumbers: [ "<serial1>", "<serial2>", … ] }
 *
 * Response:
 *   { success: true, pushed: <number of tokens sent> }
 */
router.post(
    '/v1/push/:passTypeIdentifier',
    requireAppleToken,
    async (req, res, next) => {
        try {
            const { passTypeIdentifier } = req.params;
            const { serialNumbers } = req.body;

            if (!Array.isArray(serialNumbers)) {
                return res.status(400).send('Missing serialNumbers array');
            }

            // 1) Find all registrations for this passTypeIdentifier + any of these serials
            const regsSnap = await db
                .collection('registrations')
                .where('passTypeIdentifier', '==', passTypeIdentifier)
                .where('serialNumber', 'in', serialNumbers)
                .get();

            // Collect each unique deviceLibraryIdentifier
            const deviceIds = Array.from(new Set(
                regsSnap.docs.map(doc => doc.data().deviceLibraryIdentifier)
            ));

            // 2) Lookup each device’s pushToken
            const tokens = [];
            await Promise.all(deviceIds.map(async deviceId => {
                const devSnap = await db.collection('devices').doc(deviceId).get();
                if (devSnap.exists) {
                    const { pushToken } = devSnap.data();
                    if (pushToken) tokens.push(pushToken);
                }
            }));

            if (tokens.length === 0) {
                return res.json({ success: true, pushed: 0 });
            }

            // 3) Build & send the silent APN notification
            const note = new apn.Notification({
                topic: process.env.APPLE_PASS_TOPIC,   // e.g. "pass.vn.edu.vgu.careerfair.cfied25"
                pushType: 'background',
                contentAvailable: true,
                payload: {}                            // empty JSON as required
            });

            const result = await apnProvider.send(note, tokens);
            console.log('APNs result:', result);

            // 4) Cleanup any invalid tokens
            for (const failure of result.failed) {
                const badToken = failure.device;
                const status = failure.status;              // e.g. 410
                const reason = failure.response?.reason;    // e.g. "Unregistered"
                if ([410, 400].includes(status) || ['BadDeviceToken', 'Unregistered'].includes(reason)) {
                    // find & delete the device record
                    const badDevSnap = await db
                        .collection('devices')
                        .where('pushToken', '==', badToken)
                        .limit(1)
                        .get();

                    if (!badDevSnap.empty) {
                        const badId = badDevSnap.docs[0].id;
                        await db.collection('devices').doc(badId).delete();
                        // remove all registrations for that device
                        const regsToDelete = await db
                            .collection('registrations')
                            .where('deviceLibraryIdentifier', '==', badId)
                            .get();
                        regsToDelete.forEach(d => d.ref.delete());
                    }
                }
            }

            // 5) Return how many pushes were sent
            return res.json({ success: true, pushed: result.sent.length });
        } catch (err) {
            next(err);
        }
    }
);



module.exports = router;
