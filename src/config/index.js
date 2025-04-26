const Joi = require('joi');

const schema = Joi.object({
  PORT: Joi.number().default(3000),
  SMTP_HOST: Joi.string().required(),
  SMTP_PORT: Joi.number().required(),
  SMTP_USER: Joi.string().required(),
  SMTP_PASS: Joi.string().required(),
  FIREBASE_PROJECT_ID: Joi.string().required(),
  FIREBASE_CLIENT_EMAIL: Joi.string().required(),
  FIREBASE_PRIVATE_KEY: Joi.string().required(),
  GW_SERVICE_ACCOUNT_EMAIL: Joi.string().required(),
  GW_PRIVATE_KEY: Joi.string().required(),
  GW_ISSUER_ID: Joi.string().required(),
  AW_P12_PATH: Joi.string().required(),
  AW_P12_PASSWORD: Joi.string().required(),
})
  .unknown()
  .required();

const { error, value: env } = schema.validate(process.env);
if (error) {
  throw new Error(`Config validation error: ${error.message}`);
}

module.exports = {
  PORT: env.PORT,
  smtp: {
    host: env.SMTP_HOST,
    port: env.SMTP_PORT,
    user: env.SMTP_USER,
    pass: env.SMTP_PASS,
  },
  firebase: {
    projectId: env.FIREBASE_PROJECT_ID,
    clientEmail: env.FIREBASE_CLIENT_EMAIL,
    privateKey: env.FIREBASE_PRIVATE_KEY.replace(/\\n/g, '\n'),
  },
  googleWallet: {
    serviceAccountEmail: env.GW_SERVICE_ACCOUNT_EMAIL,
    privateKey: env.GW_PRIVATE_KEY.replace(/\\n/g, '\n'),
    issuerId: env.GW_ISSUER_ID,
  },
  appleWallet: {
    p12Path: env.AW_P12_PATH,
    p12Password: env.AW_P12_PASSWORD,
  },
};
