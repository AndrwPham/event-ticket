const fs = require('fs');
const path = require('path');
const { PKPass } = require('passkit-generator');

const { appleWallet } = require('../config');
const { auth } = require('firebase-admin');
const {
  wwdrPath,
  signerCertPath,
  signerKeyPath,
  signerKeyPassphrase,
  teamIdentifier,
  passTypeIdentifier,
  templateFolder,
  webServiceURL,
  authToken
} = appleWallet;

const certificates = {
  wwdr: fs.readFileSync(path.resolve(__dirname, wwdrPath)),
  signerCert: fs.readFileSync(path.resolve(__dirname, signerCertPath)),
  signerKey: fs.readFileSync(path.resolve(__dirname, signerKeyPath)),
  signerKeyPassphrase
};

const baseProps = {
  teamIdentifier,
  passTypeIdentifier,
  organizationName: "VGU Career Services",
  description: "Entrance ticket for Career Fair and Industrial Exploration Day 2025",
  webServiceURL,
  authenticationToken: authToken,
};

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
 * @param {string} email     – user’s email (for display, not serial)
 * @param {string} fullName  – to display on the pass
 * @param {string} code      – QR code / barcode value
 * @param {string} serial    – unique serial number (from JWT)
 * @param {object} [fields]  – additional fields to display (optional)
 * @returns {Buffer}         – raw .pkpass data
 */
async function createPassForUser(email, fullName, code, serial, fields = {}) {
  if (!passTemplate) {
    throw new Error('Template not initialized! Call initTemplate() first.');
  }

  const serialNumber = serial;

  const pass = await PKPass.from(
    passTemplate,
    {
      serialNumber
    }
  );
  pass.setBarcodes(code);
  pass.secondaryFields = [
    {
      key: 'name',
      label: 'Attendee',
      value: fullName,
      textAlignment: 'PKTextAlignmentLeft'
    },
    ...Object.entries(fields).map(([key, value]) => ({
      key,
      label: key.replace(/([A-Z])/g, ' $1').replace(/^./, s => s.toUpperCase()),
      value,
      textAlignment: 'PKTextAlignmentRight'
    }))
  ];

  return pass.getAsBuffer();
}

module.exports = {
  initTemplate,
  createPassForUser
};
