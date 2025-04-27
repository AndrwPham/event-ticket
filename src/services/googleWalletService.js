const { GoogleAuth } = require('google-auth-library');
const jwt = require('jsonwebtoken');
const credentials = require('../../wallet-service-account.json');

const issuerId = '3388000000022243308';
const classId = `${issuerId}.cfied_2025.test2`;
const baseUrl = 'https://walletobjects.googleapis.com/walletobjects/v1';

const httpClient = new GoogleAuth({
  credentials: credentials,
  scopes: 'https://www.googleapis.com/auth/wallet_object.issuer'
});

/**
 * Create the Pass Class (only called once at server start)
 */
async function createPassClass() {
  const genericClass = {
    "id": `${classId}`,
    "classTemplateInfo": {
      "cardTemplateOverride": {
        "cardRowTemplateInfos": [
          {
            "twoItems": {
              "startItem": {
                "firstValue": {
                  "fields": [
                    {
                      "fieldPath": "object.textModulesData['booth_visited']"
                    }
                  ]
                }
              },
              "endItem": {
                "firstValue": {
                  "fields": [
                    {
                      "fieldPath": "object.textModulesData['lucky_number']"
                    }
                  ]
                }
              }
            }
          }
        ]
      }
    }
  };

  try {
    // Check if class exists
    await httpClient.request({
      url: `${baseUrl}/genericClass/${classId}`,
      method: 'GET'
    });

    console.log('✅ Google Wallet class already exists.');
  } catch (err) {
    if (err.response && err.response.status === 404) {
      console.log('Creating new Wallet class...');
      await httpClient.request({
        url: `${baseUrl}/genericClass`,
        method: 'POST',
        data: genericClass
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
async function createPassObject(email, fullName, code) {
  const objectSuffix = `${email.replace(/[^\w.-]/g, '_')}_2`;
  const objectId = `${issuerId}.${objectSuffix}`;

  const genericObject = {
    "id": objectId,
    "classId": classId,
    "logo": {
      "sourceUri": {
        "uri": "https://scontent.fsgn2-6.fna.fbcdn.net/v/t39.30808-6/488146270_122110518188820438_1310271617401206351_n.jpg?_nc_cat=110&ccb=1-7&_nc_sid=6ee11a&_nc_ohc=uaP-JbDaQI4Q7kNvwFjH5BB&_nc_oc=Adl3ce9KLBmVdYX79wuNeqNjrngSXRs6YbOs9LOQYQK1K0QuGL9YwejBKEpXyFwchWm_WgKi0FkatF22lWt6Npfg&_nc_zt=23&_nc_ht=scontent.fsgn2-6.fna&_nc_gid=Xsi_mlHWttFhHT3iuu2CdA&oh=00_AfHUPkpfrdAtoFwf4ZjSF5hzN-hRqdYhF3tD4b2HQHPr9w&oe=680E57A9"
      },
      "contentDescription": { "defaultValue": { "language": "en-US", "value": "LOGO" } }
    },
    "cardTitle": {
      "defaultValue": {
        "language": "en-US",
        "value": "CFIED 2025"
      }
    },
    "subheader": {
      "defaultValue": {
        "language": "en-US",
        "value": "Attendee"
      }
    },
    "header": {
      "defaultValue": {
        "language": "en-US",
        "value": fullName
      }
    },
    "textModulesData": [
      { "id": "booth_visited", "header": "BOOTH VISITED", "body": "0" },
      { "id": "lucky_number", "header": "LUCKY NUMBER", "body": "79" }
    ],
    "barcode": {
      "type": "QR_CODE",
      "value": code,
      "alternateText": ""
    },
    "hexBackgroundColor": "#003f20",
    "heroImage": {
      "sourceUri": {
        "uri": "https://scontent.fsgn2-6.fna.fbcdn.net/v/t39.30808-6/488680488_122110516778820438_4090527805399189186_n.jpg?_nc_cat=111&ccb=1-7&_nc_sid=cc71e4&_nc_ohc=hgoFX4w8PkEQ7kNvwEkP8ZB&_nc_oc=AdkUi8qesjc5RkSJL3ruIUq732FPPX4lr_yjGt2WzU9-usKAG1EUdPtuOTL6Yy1xrcnIlgMfZWRq7xJquqRgAf4N&_nc_zt=23&_nc_ht=scontent.fsgn2-6.fna&_nc_gid=ZiIpYqx878eQEm1e5LP9Pw&oh=00_AfGBkvRXJ5mUTMi-Nvep9DkW4OwbnFY3ozV0QzwrUswRGA&oe=680E6E74"
      },
      "contentDescription": { "defaultValue": { "language": "en-US", "value": "HERO IMAGE" } }
    }
  };

  const claims = {
    iss: credentials.client_email,
    aud: 'google',
    origins: [],
    typ: 'savetowallet',
    payload: {
      genericObjects: [genericObject]
    }
  };

  const token = jwt.sign(claims, credentials.private_key, { algorithm: 'RS256' });
  const saveUrl = `https://pay.google.com/gp/v/save/${token}`;

  return saveUrl;
}

module.exports = {
  createPassClass,
  createPassObject
};
