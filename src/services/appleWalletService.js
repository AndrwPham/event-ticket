const fs = require('fs');
const path = require('path');
const { PKPass } = require('passkit-generator');

const { appleWallet } = require('../config');
const {
  wwdrPath,
  signerCertPath,
  signerKeyPath,
  signerKeyPassphrase,
  teamIdentifier,
  passTypeIdentifier,
  templateFolder,       // e.g. './templates/cfied.pass'
  webServiceURL,        // e.g. 'https://your.server.com/appleWallet'
} = appleWallet;

// --- 2. Read certificates into memory ---
const certificates = {
  wwdr:       fs.readFileSync(path.resolve(__dirname, wwdrPath)),
  signerCert: fs.readFileSync(path.resolve(__dirname, signerCertPath)),
  signerKey:  fs.readFileSync(path.resolve(__dirname, signerKeyPath)),
  signerKeyPassphrase
};

// --- 3. Prepare base props for your template passes ---
const baseProps = {
  // Standard pass metadata
  teamIdentifier,
  passTypeIdentifier,
  organizationName: "VGU Career Services",
  description: "Entrance ticket for Career Fair and Industrial Exploration Day 2025",
  webServiceURL,    // Enables remote update calls
};

/**
 * A cached "runtime template" which we clone for each user.
 */
let passTemplate = null;

/**
 * Load your .pass folder into a PKPass instance.
 * Call this once, at server startup.
 */
async function initTemplate() {
  const modelPath = path.resolve(__dirname, templateFolder);
  passTemplate = await PKPass.from(
    { model: modelPath, certificates },
    baseProps
  );
  console.log('✅ Apple Wallet template initialized.');
}

/**
 * Generate a user-specific .pkpass buffer.
 *
 * @param {string} email     – user’s email (to derive serialNumber)
 * @param {string} fullName  – to display on the pass
 * @param {string} code      – QR code / barcode value
 * @returns {Buffer}         – raw .pkpass data
 */
async function createPassForUser(email, fullName, code) {
  if (!passTemplate) {
    throw new Error('Template not initialized! Call initTemplate() first.');
  }

  // Make a filesystem-safe serial number
  const serialNumber = email.replace(/[^\w.-]/g, '_');

  // Clone the template and override dynamic fields
  const pass = await PKPass.from(
    passTemplate,
    {
      serialNumber,
      name: fullName,
    }
  );
  pass.setBarcodes(code);

  return pass.getAsBuffer();
}

module.exports = {
  initTemplate,
  createPassForUser
};
