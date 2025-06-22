const { GoogleAuth } = require('google-auth-library');
const jwt = require('jsonwebtoken');
const { googleWallet } = require('../config');
const credentials = require(googleWallet.serviceAccount);

const issuerId = googleWallet.issuerId;
const classId = `${issuerId}.cfied_2025.generalAdmission`;
const baseUrl = 'https://walletobjects.googleapis.com/walletobjects/v1';

const httpClient = new GoogleAuth({
  credentials: credentials,
  scopes: 'https://www.googleapis.com/auth/wallet_object.issuer'
});

/**
 * Create the Pass Class (only called once at server start)
 */
async function createPassClass() {
  const eventTicketClass = {
    "id": `${classId}`,
    "issuerName": "VGU Career Services",
    "reviewStatus": "UNDER_REVIEW",
    "eventName": {
      "defaultValue": { "language": "en-US", "value": "Career Fair and Industrial Exploration Day 2025" }
    },
    "logo": {
      "sourceUri": {
        "uri": "https://raw.githubusercontent.com/fuisl/cfied25-ticket/main/src/assets/logo.jpg"
      },
      "contentDescription": { "defaultValue": { "language": "en-US", "value": "LOGO" } }
    },
    "heroImage": {
      "sourceUri": {
        "uri": "https://raw.githubusercontent.com/fuisl/cfied25-ticket/main/src/assets/banner.jpg"
      },
      "contentDescription": { "defaultValue": { "language": "en-US", "value": "HERO IMAGE" } }
    },
    "eventId": "CFIED2025",
    "venue": {
      "name": { "defaultValue": { "language": "en-US", "value": "Conventional Hall, VGU Campus" } },
      "address": { "defaultValue": { "language": "en-US", "value": "Vanh Dai 4 St., Thoi Hoa Ward\nBen Cat, Binh Duong" } }
    },
    "dateTime": {
      "doorsOpen": "2025-05-14T08:00:00+07:00",
      "start": "2025-05-14T08:30:00+07:00",
      "end": "2025-05-14T13:30:00+07:00"
    },
    "merchantLocation":
      [{
        "latitude": 11.0572,
        "longitude": 106.6442
      }],
    "classTemplateInfo": {
      "cardTemplateOverride": {
        "cardRowTemplateInfos": [
          {
            "twoItems": {
              "startItem": {
                "firstValue": {
                  "fields": [
                    {
                      "fieldPath": "object.textModulesData['full_name']"
                    }
                  ]
                }
              },
            }
          }
        ]
      }
    }
  };

  try {
    // Check if class exists
    await httpClient.request({
      url: `${baseUrl}/eventTicketClass/${classId}`,
      method: 'GET'
    });

    console.log('✅ Google Wallet class already exists.');
  } catch (err) {
    if (err.response && err.response.status === 404) {
      console.log('Creating new Wallet class...');
      await httpClient.request({
        url: `${baseUrl}/eventTicketClass`,
        method: 'POST',
        data: eventTicketClass
      });
      console.log('✅ Google Wallet class created successfully.');
    } else {
      console.error('❌ Error checking/creating class:', err);
      throw err;
    }
  }
}

/**
 * Create a Wallet pass for the user
 */
async function createOrUpdatePassObject(payload) {
  const { email, name, code, class: ticketClass, seat, price, event, eventId, status } = payload;
  // Use class name if provided, otherwise fallback to default
  const className = ticketClass ? ticketClass.replace(/\s+/g, '').toLowerCase() : 'generalAdmission';
  const eventCode = eventId ? eventId.replace(/[^a-zA-Z0-9._-]/g, '_') : 'CFIED2025';
  const dynamicClassId = `${issuerId}.${eventCode}.${className}`;
  // Sanitize objectSuffix for Google Wallet requirements
  const objectSuffix = `${email}`.replace(/[^a-zA-Z0-9._-]/g, '_');
  const objectId = `${issuerId}.${objectSuffix}`;

  // Try to ensure the class exists (create if not)
  try {
    await httpClient.request({
      url: `${baseUrl}/eventTicketClass/${dynamicClassId}`,
      method: 'GET'
    });
    // Class exists
  } catch (err) {
    if (err.response && err.response.status === 404) {
      // Create new class on the fly
      const eventTicketClass = {
        "id": dynamicClassId,
        "issuerName": "VGU Career Services",
        "reviewStatus": "UNDER_REVIEW",
        "eventName": {
          "defaultValue": { "language": "en-US", "value": event || "Career Fair and Industrial Exploration Day 2025" }
        },
        "logo": {
          "sourceUri": {
            "uri": "https://raw.githubusercontent.com/fuisl/cfied25-ticket/main/src/assets/logo.jpg"
          },
          "contentDescription": { "defaultValue": { "language": "en-US", "value": "LOGO" } }
        },
        "heroImage": {
          "sourceUri": {
            "uri": "https://raw.githubusercontent.com/fuisl/cfied25-ticket/main/src/assets/banner.jpg"
          },
          "contentDescription": { "defaultValue": { "language": "en-US", "value": "HERO IMAGE" } }
        },
        "eventId": eventCode,
        "venue": {
          "name": { "defaultValue": { "language": "en-US", "value": "Conventional Hall, VGU Campus" } },
          "address": { "defaultValue": { "language": "en-US", "value": "Vanh Dai 4 St., Thoi Hoa Ward\nBen Cat, Binh Duong" } }
        },
        "dateTime": {
          "doorsOpen": "2025-05-14T08:00:00+07:00",
          "start": "2025-05-14T08:30:00+07:00",
          "end": "2025-05-14T13:30:00+07:00"
        },
        "merchantLocation": [
          {
            "latitude": 11.0572,
            "longitude": 106.6442
          }
        ],
        "classTemplateInfo": {
          "cardTemplateOverride": {
            "cardRowTemplateInfos": [
              {
                "twoItems": {
                  "startItem": {
                    "firstValue": {
                      "fields": [
                        { "fieldPath": "object.textModulesData['full_name']" }
                      ]
                    }
                  },
                  "endItem": {
                    "firstValue": {
                      "fields": [
                        { "fieldPath": "object.textModulesData['admission_level']" }
                      ]
                    }
                  }
                }
              },
              {
                "twoItems": {
                  "startItem": {
                    "firstValue": {
                      "fields": [
                        { "fieldPath": "object.textModulesData['seat']" }
                      ]
                    }
                  },
                  "endItem": {
                    "firstValue": {
                      "fields": [
                        { "fieldPath": "object.textModulesData['price']" }
                      ]
                    }
                  }
                }
              }
            ]
          }
        }
      };
      await httpClient.request({
        url: `${baseUrl}/eventTicketClass`,
        method: 'POST',
        data: eventTicketClass
      });
    } else {
      throw err;
    }
  }

  const eventTicketObject = {
    "id": objectId,
    "classId": dynamicClassId,
    "ticketType": {
      "defaultValue": {
        "language": "en-US",
        "value": ticketClass || "General Admission"
      }
    },
    "state": "ACTIVE",
    "cardTitle": {
      "defaultValue": {
        "language": "en-US",
        "value": event || "CFIED 2025"
      }
    },
    "linkModulesData": [
      {
        "uri": {
          "uri": "https://www.facebook.com/VGU.CFIED",
          "description": { "defaultValue": { "language": "en-US", "value": "CFIED2025 Facebook Fanpage" } }
        }
      },
      {
        "uri": {
          "uri": "https://careerfair.vgu.edu.vn",
          "description": { "defaultValue": { "language": "en-US", "value": "CFIED2025 Website" } }
        }
      }
    ],
    "textModulesData": [
      { "id": "full_name", "header": "Attendee", "body": name },
      ...(seat ? [{ "id": "seat", "header": "Seat", "body": seat }] : []),
      ...(price ? [{ "id": "price", "header": "Price", "body": price }] : []),
      ...(ticketClass ? [{ "id": "admission_level", "header": "Admission Level", "body": ticketClass }] : []),
    ],
    "barcode": {
      "type": "QR_CODE",
      "value": code,
      "alternateText": ""
    },
    "hexBackgroundColor": "#003f20",
  };

  let exists = false;
  try {
    await httpClient.request({
      url: `${baseUrl}/eventTicketObject/${objectId}`,
      method: 'GET',
    });
    exists = true;
    console.log('🔄 Wallet object exists, updating…');
  } catch (err) {
    if (err.response && err.response.status === 404) {
      console.log('➕ Wallet object not found, creating…');
    } else {
      console.error('❌ Error checking object existence:', err);
      throw err;
    }
  }

  if (exists) {
    // You can choose PATCH with updateMask or full PUT to replace
    await httpClient.request({
      url: `${baseUrl}/eventTicketObject/${objectId}`,
      method: 'PUT',
      data: eventTicketObject,
    });
    console.log('✅ Wallet object updated.');
  } else {
    await httpClient.request({
      url: `${baseUrl}/eventTicketObject`,
      method: 'POST',
      data: eventTicketObject,
    });
    console.log('✅ Wallet object created.');
  }

  const claims = {
    iss: credentials.client_email,
    aud: 'google',
    origins: [],
    typ: 'savetowallet',
    payload: {
      eventTicketObjects: [eventTicketObject]
    }
  };

  const token = jwt.sign(claims, credentials.private_key, { algorithm: 'RS256' });
  const saveUrl = `https://pay.google.com/gp/v/save/${token}`;

  return saveUrl;
}

module.exports = {
  createPassClass,
  createPassObject: createOrUpdatePassObject,
};
