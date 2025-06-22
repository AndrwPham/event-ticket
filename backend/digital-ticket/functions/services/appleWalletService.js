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
  organizationName: "VGU LIA",
  description: "Digital Ticket",
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

  let restFields = { ...fields };
  let admissionLevelField = null;
  if (fields.class) {
    admissionLevelField = {
      key: 'admission_level',
      label: 'Admission Level',
      value: fields.class,
      textAlignment: 'PKTextAlignmentRight'
    };
  } else if (fields.ticketClass) {
    admissionLevelField = {
      key: 'admission_level',
      label: 'Admission Level',
      value: fields.ticketClass,
      textAlignment: 'PKTextAlignmentRight'
    };
  }

  // Build auxiliary fields: Admission Level (align left), Price (align left)
  const auxiliaryFields = [];
  if (admissionLevelField) {
    admissionLevelField.textAlignment = 'PKTextAlignmentLeft';
    auxiliaryFields.push(admissionLevelField);
  }
  if (typeof fields.price !== 'undefined') {
    auxiliaryFields.push({
      key: 'price',
      label: 'Price',
      value: fields.price,
      textAlignment: 'PKTextAlignmentLeft'
    });
  }

  const secondaryFieldsArray = [
    {
      key: 'name',
      label: 'Attendee',
      value: fullName,
      textAlignment: 'PKTextAlignmentLeft'
    }
  ];
  if (typeof fields.seat !== 'undefined') {
    secondaryFieldsArray.push({
      key: 'seat',
      label: 'Seat',
      value: fields.seat,
      textAlignment: 'PKTextAlignmentRight'
    });
  }

  // Ensure eventTicket fields are set for event ticket pass type
  if (pass.eventTicket) {
    if (!pass.eventTicket.auxiliaryFields) pass.eventTicket.auxiliaryFields = [];
    if (!pass.eventTicket.secondaryFields) pass.eventTicket.secondaryFields = [];
    pass.eventTicket.auxiliaryFields.push(...auxiliaryFields);
    pass.eventTicket.secondaryFields.push(...secondaryFieldsArray);
  } else {
    // fallback for generic pass types
    pass.auxiliaryFields.push(...auxiliaryFields);
    pass.secondaryFields.push(...secondaryFieldsArray);
  }

  return pass.getAsBuffer();
}

module.exports = {
  initTemplate,
  createPassForUser
};
