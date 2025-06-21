const CHARS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
/** Returns a random 6-char string. */
function generateCode() {
  let code = '';
  for (let i = 0; i < 6; i++) {
    code += CHARS.charAt(Math.floor(Math.random() * CHARS.length));
  }
  return code;
}

/**
 * Loops until it finds a code not yet in Firestore.
 * @param {FirebaseFirestore.Firestore} db
 */
async function createUniqueCode(db) {
  let code, snap;
  do {
    code = generateCode();
    snap = await db.collection('userQRCodes').doc(code).get();
  } while (snap.exists);
  return code;
}

module.exports = { createUniqueCode };